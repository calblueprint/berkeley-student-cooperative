import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { getShift } from '../firebase/queries/shift'
import { User, Shift } from '../types/schema'
import { useEffect } from 'react'
import { getHouse } from '../firebase/queries/house'
import { updateUser, getUser } from '../firebase/queries/user'
import Button from '@mui/material/Button'
import { updateShift } from '../firebase/queries/shift'
import { convertTimeWindowToTime, pluralizeHours } from '../firebase/helpers'
import { sortPotentialUsers, findAvailableUsers } from '../firebase/helpers'
import SortedTable from '../components/shared/tables/SortedTable'
import { numericToStringPreference } from '../firebase/helpers'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useGetUsersQuery } from '../store/apiSlices/userApiSlice'
import { selectShiftById } from '../store/apiSlices/shiftApiSlice'
type ShiftAssignmentComponentCardProps = {
  day: string
  houseID: string
  shiftID: string
}

// id = attribute name in schema
const headCells: HeadCell<Shift>[] = [
  {
    id: 'fullName',
    isNumeric: false,
    label: 'Available Users',
    isSortable: false,
    align: 'left'
  },
  {
    id: 'hoursUnassigned',
    isNumeric: true,
    label: 'Unassigned Hours',
    isSortable: true,
    align: 'left'
  },
  {
    id: 'preference',
    isNumeric: false,
    label: 'Preference',
    isSortable: true,
    align: 'left'
  },
]

// state doesn't work, no selected / update shift /user
const ShiftAssignmentComponentCard: React.FC<
  ShiftAssignmentComponentCardProps
> = ({ day, houseID, shiftID }: ShiftAssignmentComponentCardProps) => {
  /**
   * A modal that appears when a manager wants to assign people/unassign people from a shift.
   * Matches people to shifts based on availabilities.
   * @remarks
   * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
   * Contains a ShiftAssignmentTable.
   *
   * @param day - The day that is selected when the manager is going through shifts on a day-by-day view
   * @param houseID - The ID of the house that the manager manages
   * @param shiftID - The ID of the shift that the manager has selected.
   * @returns ShiftAssignmentComponentCard
   */

  // Store potentialWorkersObject
  const {
    data: usersObject,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError
  } = useGetUsersQuery({})

  // Store shiftObject
  const {
    data: shiftObject,
    isLoading: isShiftLoading,
    isSuccess: isShiftSuccess,
    isError: isShiftError
  } = selectShiftById(state, shiftID)

  // Stores the list of potential worker IDs eligible to do this shift
  const [potentialWorkersID, setPotentialWorkersID] = useState<EntityId[] | undefined>([])
  // Stores the users that the manager has selected so far to complete this shift
  // const [selectedRows, setSelectedRows] = useState<string[]>([]) (SELECTED ROWS IS DONE)
 
  // On page load, retrieves the shift and sets the shift Object and also populates the potentialWorkers + selectedRows arrays
  useEffect(() => {
    filterIDsByHouseAndAvailability();
    sortAndAddFieldsToUsers();
  }, []) 
 
  // update ids of worker display ids
  const sortAndAddFieldsToUsers = () => {
    if (potentialWorkersID === undefined || usersObject === undefined) {
      return;
    }
    let copy = sortPotentialUsers(usersObject.entities, potentialWorkersID, shiftID); //ids
    setPotentialWorkersID(copy);
    for (let i = 0; i < potentialWorkersID.length; i++) {
      let id = potentialWorkersID[i];
      let worker = usersObject.entities[id];
      if (worker === undefined) {
        continue;
      }
      worker.fullName = worker.firstName + " " + worker.lastName;
      worker.preference = numericToStringPreference(worker, shiftID);
      worker.hoursUnassigned = worker.hoursRequired - worker.hoursAssigned;
    }
  }

  const filterIDsByHouseAndAvailability = () => {
    let workersInHouse = usersObject?.ids.filter(
        (id: EntityId) => usersObject?.entities[id]?.houseID == houseID
      );
    if (usersObject !== undefined && workersInHouse !== undefined) {
      let avail = findAvailableUsers(shiftObject, usersObject.entities, workersInHouse, shiftID, day);
      setPotentialWorkersID(avail);
    }
  }


  // Function called when assign is clicked to update the backend
  const updateUserAndShiftObjects = async () => {
    await updateUserObjects()
    await updateShiftObject()
    // Refetch so not using stale data (may or may not remove, depending on use) (PROB NEED TO CHANGE STALE DATA)
    // retrieveShift()
    // populatePotentialWorkersAndSelected()
  }

  // Updates the user objects by clearing all people assigned to the shift
  // const updateUserObjects = async () => {
  //   // hoursAssigned
  //   // clear prior
  //   if (
  //     shiftObject !== undefined &&
  //     selectedRows.length <= shiftObject.numOfPeople
  //   ) {
  //     // Decreases hours assigned for all of the workers who are assigned, but not included in the selected rows list (they were removed)
  //     for (let i = 0; i < potentialWorkers.length; i++) {
  //       let user = potentialWorkers[i]
  //       if (
  //         user.shiftsAssigned.includes(shiftID) &&
  //         !selectedRows.includes(user.userID)
  //       ) {
  //         let copy = [...user.shiftsAssigned]
  //         let index = copy.indexOf(shiftID)
  //         copy.splice(index, 1)
  //         let newHours = user.hoursAssigned
  //         if (shiftObject !== undefined) {
  //           newHours -= shiftObject.hours
  //         }
  //         let newData = {
  //           shiftsAssigned: copy,
  //           hoursAssigned: newHours,
  //         }
  //         await updateUser(user.userID, newData)
  //       }
  //     }
  //     for (let i = 0; i < selectedRows.length; i++) {
  //       let userID = selectedRows[i]
  //       const user = await getUser(userID)
  //       if (user === null || user === undefined || user.shiftsAssigned.includes(shiftID)) {
  //         continue
  //       }
  //       let copy = [...user.shiftsAssigned]
  //       copy.push(shiftID)
  //       if (user === undefined) {
  //         continue;
  //       }
  //       let newHours = user.hoursAssigned
  //       if (shiftObject !== undefined) {
  //         newHours += shiftObject.hours
  //       }
  //       let newData = {
  //         shiftsAssigned: copy,
  //         hoursAssigned: newHours,
  //       }
  //       await updateUser(userID, newData)
  //     }
  //   } else {
  //     // replace w modal
  //     console.log('Too many people selected')
  //   }
  // }

  // Updates the shiftObject with the assigned day and the people assigned to that shift
  // If 0 selected rows, reset day to ""
  // const updateShiftObject = async () => {
  //   if (
  //     shiftObject !== undefined &&
  //     selectedRows.length <= shiftObject.numOfPeople
  //   ) {
  //     let assignedDay = day
  //     if (selectedRows.length == 0) {
  //       assignedDay = ''
  //     }
  //     let newData = {
  //       usersAssigned: selectedRows,
  //       assignedDay: assignedDay,
  //     }
  //     await updateShift(houseID, shiftID, newData)
  //   }
  // }

  return (
    <div className={styles.container}>
      <h3>{shiftObject?.name}</h3>
      <div id="shiftAssignmentHeaderFlex">
        <div className="shiftAssignmentHeaderEntry">
          {shiftObject && pluralizeHours(shiftObject.hours)}
        </div>
        <div className="shiftAssignmentHeaderEntry">{day}</div>
        <div className="shiftAssignmentHeaderEntry">
          {shiftObject &&
            convertTimeWindowToTime(
              shiftObject.timeWindow[0],
              shiftObject.timeWindow[1]
            )}
        </div> 
        <div className="shiftAssignmentHeaderEntry">
          {shiftObject && pluralizeHours(shiftObject.verificationBuffer)}
        </div>
        <div className="shiftAssignmentHeaderEntry">
          {shiftObject && shiftObject.category}
        </div>
      </div>
      {potentialWorkersID &&
        <SortedTable 
          data = {potentialWorkersID}
          headCells = {headCells}
          isCheckable = {true}
          isSortable = {false}
          // handle row click here???
        />
      }
      <Button onClick={updateUserAndShiftObjects}>Save</Button>
    </div>
  )
}

export default ShiftAssignmentComponentCard
