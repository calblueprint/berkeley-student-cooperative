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
import { useGetUsersQuery, useUpdateUserMutation } from '../store/apiSlices/userApiSlice'
import { selectShiftById, useUpdateShiftMutation } from '../store/apiSlices/shiftApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

// waiting on sorted table to only allow selecting 1 checkbox at a time
// pass in something that's been selected

type ShiftAssignmentComponentCardProps = {
  day: string
  houseID: string
  shiftID: string
}

// id = attribute name in schema
const headCells: HeadCell<Shift>[] = [
  {
    id: 'displayName',
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
  } = useGetUsersQuery({houseID})

  const [
    updateShift,
    {
      // isLoading: isLoadingUpdateShift,
      // isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const [
    updateUser,
    {
      // isLoading: isLoadingUpdateShift,
      // isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateUserMutation();

  const shiftObject = useSelector((state: RootState) =>
    selectShiftById('EUC')(state, shiftID as EntityId) as Shift
  )

  const [potentialWorkersID, setPotentialWorkersID] = useState<EntityId[] | undefined>([])
  const [displayEntities, setDisplayEntities] = useState<Dictionary<User>>();
  const [assignedUserID, setAssignedUserID] = useState<string>("");
  
  // On page load, retrieves the shift and sets the shift Object and also populates the potentialWorkers + selectedRows arrays
  useEffect(() => {
    if (isUsersSuccess) {
      let userIDs = filterIDsByHouseAndAvailability();
      sortAndAddFieldsToUsers(userIDs);
    }
  }, [isUsersSuccess]) 

  useEffect(() => {
    let userIDs = filterIDsByHouseAndAvailability();
    sortAndAddFieldsToUsers(userIDs);
  }, []) 
 
  const filterIDsByHouseAndAvailability = () => {
    let workersInHouse = usersObject?.ids.filter(
        (id: EntityId) => usersObject?.entities[id]?.houseID == houseID
      );
    if (shiftObject.assignedUser !== undefined && shiftObject.assignedUser !== "") {
      setAssignedUserID(shiftObject.assignedUser);
    }
    if (usersObject !== undefined && workersInHouse !== undefined) {
      return findAvailableUsers(shiftObject, usersObject.entities, workersInHouse, shiftID, day);
    }
    return [];
  }

  // update ids of worker display ids
  const sortAndAddFieldsToUsers = (userIDs: EntityId[]) => {
    if (userIDs === undefined || usersObject === undefined) {
      return;
    }
    let copy = sortPotentialUsers(usersObject.entities, userIDs, shiftID); //ids
    setPotentialWorkersID(copy);
    // makes a deepcopy of entities so we can modify them
    let newDictionary: {[id: string]: User | undefined} = JSON.parse(JSON.stringify(usersObject.entities));
    for (let key in newDictionary) {
      newDictionary[key] = newDictionary[key] as User
    }
    for (let i = 0; i < copy.length; i++) {
      let id = copy[i];
      let worker: User|undefined = newDictionary[id];
      if (worker === undefined) {
        continue;
      }
      worker.displayName = worker.firstName + " " + worker.lastName;
      worker.preference = numericToStringPreference(worker, shiftID);
      worker.hoursUnassigned = 5 - worker.hoursAssigned;
    }
    setDisplayEntities(newDictionary);
  }



  // Function called when assign is clicked to update the backend
  const updateUserAndShiftObjects = async () => {
    let originallyAssignedUserID = shiftObject.assignedUser;
    if (originallyAssignedUserID === undefined) {
      originallyAssignedUserID = "";
    }
    if (originallyAssignedUserID === assignedUserID || usersObject === undefined) {
      console.log("no change");
      return;
    }
    if (originallyAssignedUserID !== "") {
      // UPDATE OLD USER
      // clear the shift id from the user's list of shifts (assignedScheduleShifts) + decrease their assigned hours
      let originalUser = usersObject.entities[originallyAssignedUserID];
      if (originalUser !== undefined) {
        let originalAssignedShifts = originalUser.assignedScheduledShifts;
        if (originalAssignedShifts === undefined) {
          originalAssignedShifts = [];
        }
        let originalUserShiftsCopy = [...originalAssignedShifts];
        let index = originalUserShiftsCopy.indexOf(shiftID, 0);
        if (index > -1) {
          originalUserShiftsCopy.splice(index, 1);
        }
        let originalUserAssignedHours = originalUser.hoursAssigned;
        let originalUserNewHours = originalUserAssignedHours - shiftObject.hours;
        console.log(originalUserNewHours);
        let dataToUpdateOldUser = { data: {}, houseId: houseID, userId: originallyAssignedUserID }
        dataToUpdateOldUser.data = {
          hoursAssigned: originalUserNewHours,
          assignedScheduledShifts: originalUserShiftsCopy
        }
        await updateUser(dataToUpdateOldUser);
      }
    }

    // UPDATE SHIFT
    // update assigned Day and assignedUser
    // decrease the number of hours of this shift to their hoursAssigned
    let dataToUpdateShift = { data: {}, houseId: houseID, shiftId: shiftID}
    if (assignedUserID === "") {
      dataToUpdateShift.data = {
        assignedDay: "",
        assignedUser: ""
      }
    } else {
      dataToUpdateShift.data = {
        assignedDay: day,
        assignedUser: assignedUserID
      }
    }
    await updateShift(dataToUpdateShift);

    // UPDATE NEW USER
    // increase their hours and push it onto the list
    if (assignedUserID === "") {
      console.log("No new user assigned");
      return;
    }
    let newUser = usersObject.entities[assignedUserID];
    if (newUser === undefined) {
      console.log("undefined id for new user");
      return;
    }
    let newUserAssignedShifts = newUser.assignedScheduledShifts;
    if (newUserAssignedShifts === undefined) {
      newUserAssignedShifts = [];
    }
    let newUserShiftsCopy = [...newUserAssignedShifts];
    let index = newUserShiftsCopy.indexOf(shiftID, 0);
    if (index == -1) {
      newUserShiftsCopy.push(shiftID);
    }
    let newAssignedHours = newUser.hoursAssigned + shiftObject.hours;
    console.log(newAssignedHours);
    let dataToUpdateNewUser = { data: {}, houseId: houseID, userId: assignedUserID }
    dataToUpdateNewUser.data = {
      hoursAssigned: newAssignedHours,
      assignedScheduledShifts: newUserShiftsCopy
    }
    await updateUser(dataToUpdateNewUser);
  }

  const updateAssignedUser = (event: React.MouseEvent<unknown>, id: string) => {
    if (id === assignedUserID) {
      console.log("untoggle");
      setAssignedUserID("");
    } else {
      setAssignedUserID(id);
    }
  }

  return (
    <div className={styles.container}>
      {potentialWorkersID && displayEntities && 
        <SortedTable 
          ids = {potentialWorkersID as EntityId[]}
          entities = {displayEntities as Dictionary<
              User & {[key in keyof User]: string | number}
            >}
          headCells = {headCells}
          isCheckable = {true}
          isSortable = {false}
          // handle row click here???
          handleRowClick = {updateAssignedUser}
        />
      }
      <Button onClick={updateUserAndShiftObjects}>Save</Button>
    </div>
  )
}

export default ShiftAssignmentComponentCard
