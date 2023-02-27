import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { getShift } from '../firebase/queries/shift'
import { User, Shift, House } from '../types/schema'
import { useEffect } from 'react'
import { getHouse } from '../firebase/queries/house'
import { updateUser, getUser } from '../firebase/queries/user'
import ShiftAssignmentTable from './shiftAssignmentTable'
import Button from '@mui/material/Button'
import { updateShift } from '../firebase/queries/shift'
import { convertTimeWindowToTime, pluralizeHours } from '../firebase/helpers'
import { sortPotentialUsers, findAvailableUsers } from '../firebase/helpers'

type ShiftAssignmentComponentCardProps = {
  day: string
  houseID: string
  shiftID: string
}

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
  // Stores the shiftObject retrieved, given the Shift ID
  const [shiftObject, setShiftObject] = useState<Shift>()
  // Stores the list of potential workers eligible to do this shift
  const [potentialWorkers, setPotentialWorkers] = useState<User[]>([])
  // Stores the users that the manager has selected so far to complete this shift
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // On page load, retrieves the shift and sets the shift Object and also populates the potentialWorkers + selectedRows arrays
  useEffect(() => {
    retrieveShift()
    populatePotentialWorkersAndSelected()
  }, [])

  const retrieveShift = async () => {
    const shift = await getShift(houseID, shiftID)
    if (shift != null) {
      setShiftObject(shift)
    }
  }

  // Helper function to initialize selected users to be, out of potential users, if they've already been assigned, add it to the list and set selected rows
  const setSelectedUsers = (potentialUsers: User[]) => {
    let selectedUsers = []
    for (let i = 0; i < potentialUsers.length; i++) {
      let user = potentialUsers[i]
      let assignedShifts = user.shiftsAssigned
      if (assignedShifts.includes(shiftID)) {
        selectedUsers.push(user.userID)
      }
    }
    setSelectedRows(selectedUsers)
  }

  // Method that is called to populate the potentialWorkers and selectedRows state elements
  const populatePotentialWorkersAndSelected = async () => {
    // Query Set Up
    const tempShiftObject = await getShift(houseID, shiftID)
    const house = await getHouse(houseID);
    if (tempShiftObject === null || tempShiftObject === undefined || house === null || house === undefined) {
      return;
    }
    let allMembersInHouse = house.members;
    if (allMembersInHouse === null || allMembersInHouse === undefined) {
      return;
    }
    let users = []
    for (let i = 0; i < allMembersInHouse.length; i++) {
      let member = allMembersInHouse[i];
      let userObject = await getUser(member);
      if (userObject === null || userObject === undefined) {
        return;
      }
      users.push(userObject);
    }
    // helper function call
    let potentialUsers = findAvailableUsers(tempShiftObject, users, shiftID, day);
    // helper function call
    sortPotentialUsers(potentialUsers, shiftID);
    setPotentialWorkers(potentialUsers)
    setSelectedUsers(potentialUsers)
  }

  // Function called when assign is clicked to update the backend
  const updateUserAndShiftObjects = async () => {
    await updateUserObjects()
    await updateShiftObject()
    // Refetch so not using stale data (may or may not remove, depending on use)
    retrieveShift()
    populatePotentialWorkersAndSelected()
  }

  // Updates the user objects by clearing all people assigned to the shift
  const updateUserObjects = async () => {
    // hoursAssigned
    // clear prior
    if (
      shiftObject !== undefined &&
      selectedRows.length <= shiftObject.numOfPeople
    ) {
      // Decreases hours assigned for all of the workers who are assigned, but not included in the selected rows list (they were removed)
      for (let i = 0; i < potentialWorkers.length; i++) {
        let user = potentialWorkers[i]
        if (
          user.shiftsAssigned.includes(shiftID) &&
          !selectedRows.includes(user.userID)
        ) {
          let copy = [...user.shiftsAssigned]
          let index = copy.indexOf(shiftID)
          copy.splice(index, 1)
          let newHours = user.hoursAssigned
          if (shiftObject !== undefined) {
            newHours -= shiftObject.hours
          }
          let newData = {
            shiftsAssigned: copy,
            hoursAssigned: newHours,
          }
          await updateUser(user.userID, newData)
        }
      }
      for (let i = 0; i < selectedRows.length; i++) {
        let userID = selectedRows[i]
        const user = await getUser(userID)
        if (user === null || user === undefined || user.shiftsAssigned.includes(shiftID)) {
          continue
        }
        let copy = [...user.shiftsAssigned]
        copy.push(shiftID)
        if (user === undefined) {
          continue;
        }
        let newHours = user.hoursAssigned
        if (shiftObject !== undefined) {
          newHours += shiftObject.hours
        }
        let newData = {
          shiftsAssigned: copy,
          hoursAssigned: newHours,
        }
        await updateUser(userID, newData)
      }
    } else {
      // replace w modal
      console.log('Too many people selected')
    }
  }

  // Updates the shiftObject with the assigned day and the people assigned to that shift
  // If 0 selected rows, reset day to ""
  const updateShiftObject = async () => {
    if (
      shiftObject !== undefined &&
      selectedRows.length <= shiftObject.numOfPeople
    ) {
      let assignedDay = day
      if (selectedRows.length == 0) {
        assignedDay = ''
      }
      let newData = {
        usersAssigned: selectedRows,
        assignedDay: assignedDay,
      }
      await updateShift(houseID, shiftID, newData)
    }
  }

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
      <ShiftAssignmentTable
        users={potentialWorkers}
        shiftID={shiftID}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Button onClick={updateUserAndShiftObjects}>Save</Button>
    </div>
  )
}

export default ShiftAssignmentComponentCard
