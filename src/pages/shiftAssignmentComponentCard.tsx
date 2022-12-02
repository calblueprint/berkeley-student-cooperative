import { useState } from "react";
import styles from "../styles/Home.module.css";
import { getShift } from "../firebase/queries/shift";
import { User, Shift, House } from "../types/schema";
import { useEffect } from "react";
import { getHouse } from "../firebase/queries/house";
import { updateUser, getUser} from "../firebase/queries/user";
import ShiftAssignmentTable from "./shiftAssignmentTable";
import Button from "@mui/material/Button";
import { updateShift } from "../firebase/queries/shift";
import { convertTimeWindowToTime, pluralizeHours } from "../firebase/helpers";

type ShiftAssignmentComponentCardProps = {
  day: string,
  houseID: string,
  shiftID: string
}

const ShiftAssignmentComponentCard: React.FC<ShiftAssignmentComponentCardProps> = ({day, houseID, shiftID}: ShiftAssignmentComponentCardProps) => {
  // Stores the shiftObject retrieved, given the Shift ID
  const [shiftObject, setShiftObject] = useState<Shift>();
  // Stores the list of potential workers eligible to do this shift
  const [potentialWorkers, setPotentialWorkers] = useState<User[]>([]);
  // Stores the users that the manager has selected so far to complete this shift
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // On page load, retrieves the shift and sets the shift Object and also populates the potentialWorkers + selectedRows arrays
  useEffect(() => {
    retrieveShift();
    populatePotentialWorkersAndSelected();
  }, []);

  const retrieveShift = async () => {
    const shift = await getShift(houseID, shiftID);
    if (shift != null) {
      setShiftObject(shift);
    }
  }
  
  // Helper function to find available users
  const findAvailableUsers = async (tempShiftObject: Shift) => {
    const timeWindow = tempShiftObject.timeWindow;
    const shiftStart = timeWindow[0];
    const shiftEnd = timeWindow[1];
    const numHours = tempShiftObject.hours;
    const potentialUsers = [];
    const house = await getHouse(houseID);
    const totalUsersInHouse = house.members;
    if (totalUsersInHouse === null || totalUsersInHouse === undefined) {
      return [];
    }
    // Convert the hours of the shift into units of time. Assumes any non-whole hour numbers are 30 minute intervals.
    // ex. 1.5 -> converted to 130 (used for differences if someone is available between 1030 and 1200, they should be shown)
    const mult100 = Math.floor(numHours) * 100;
    let thirtyMin = 0;
    if (mult100 != numHours * 100) {
      thirtyMin = 30;
    }
    
    for (let i = 0; i < totalUsersInHouse.length; i++) {
      const userID = totalUsersInHouse[i];
      const userObject = await getUser(userID);
      if (userObject === null) {
        continue;
      }
      // if this user has already been assigned to this shift, display them regardless of hours
      if (userObject.shiftsAssigned.includes(shiftID)) {
        potentialUsers.push(userObject);
        continue;
      }
      // stores the number of hours that the user still has to complete
      let assignableHours = userObject.hoursRequired - userObject.hoursAssigned;
      // if they have no hours left to complete, or their number of hours left to complete < the number of hours of the shift, continue
      if (assignableHours <= 0 || assignableHours < numHours) {
        continue;
      }
      const currAvailabilities = userObject.availabilities;
      if (currAvailabilities.has(day)) {
        const perDayAvailability = currAvailabilities.get(day);
        if (perDayAvailability === undefined) {
          continue;
        }
        // iterate thru every pair of availabilities
        for (let j = 0; j < perDayAvailability.length; j += 2) {
          let currStart = perDayAvailability[j];
          let permEnd = perDayAvailability[j + 1];
          // The end of this availability window is < the time it takes for the shift to start
          if (permEnd < shiftStart) {
            continue;
          }
          // start either at the beginning of the shift window / beginning of their availability, whichever is later
          currStart = Math.max(currStart, shiftStart);
          // The end time given the current start
          // 1030 + 100 + 30 -> 1160 (still <= 1200) (still works)
          let newEnd = currStart + mult100 + thirtyMin;
          // The required end will either be the end of the shift or the end of their availabikity
          let requiredEnd = Math.min(permEnd, shiftEnd);
          // If the calculated end time is <= required end time, then we can push and don't need to consider any more availabilities
          if (newEnd <= requiredEnd) {
            potentialUsers.push(userObject);
            break;
          }
        }
      }
    }
    return potentialUsers;
  }

  // Helper function to initialize selected users to be, out of potential users, if they've already been assigned, add it to the list and set selected rows
  const setSelectedUsers = (potentialUsers: User[]) => {
    let selectedUsers = [];
    for (let i = 0; i < potentialUsers.length; i++) {
        let user = potentialUsers[i];
        let assignedShifts = user.shiftsAssigned;
        if (assignedShifts.includes(shiftID)) {
            selectedUsers.push(user.userID);
        }
    }
    setSelectedRows(selectedUsers);
  }

  // Method that is called to populate the potentialWorkers and selectedRows state elements
  const populatePotentialWorkersAndSelected = async () => {
    const tempShiftObject = await getShift(houseID, shiftID);
    if (tempShiftObject === null || tempShiftObject === undefined) {
      return;
    }
    let potentialUsers = await findAvailableUsers(tempShiftObject);

    // Sorts on hou
    potentialUsers.sort((user1, user2) => {
      // First sort on hours assignable left (hoursRequired - hoursAssigned), prioritizing people with higher hours remaining (user2 - user1)
      let user1HoursLeft = user1.hoursRequired - user1.hoursAssigned;
      let user2HoursLeft = user2.hoursRequired - user2.hoursAssigned;
      let hoursWeekDiff: number = user2HoursLeft - user1HoursLeft;
      if (hoursWeekDiff != 0) {
        return hoursWeekDiff;
      }

      let user1Preferences = user1.preferences;
      let user2Preferences = user2.preferences;
      // 1 if 1 is average
      let user1Pref = 1;
      let user2Pref = 1;
      if (user1Preferences.has(shiftID)) {
        let curr = user1Preferences.get(shiftID);
        if (curr !== undefined) {
          user1Pref = curr;
        }
      }
      if (user2Preferences.has(shiftID)) {
        let curr = user2Preferences.get(shiftID);
        if (curr !== undefined) {
          user2Pref = curr;
        }
      }
      // Second sort on preferences, prioritizing people with higher preferences (user2 - user1)
      let prefDiff = user2Pref - user1Pref;
      if (prefDiff != 0) {
        return prefDiff;
      }
      // Third sort on hoursRemainingSemester, prioritizing people with higher hoursRemaining (user 2 - user1)
      return user2.hoursRemainingSemester - user1.hoursRemainingSemester;
    });
    setPotentialWorkers(potentialUsers);
    setSelectedUsers(potentialUsers);
  }

  // Function called when assign is clicked to update the backend
  const updateUserAndShiftObjects = async () => {
    await updateUserObjects();
    await updateShiftObject();
    // Refetch so not using stale data (may or may not remove, depending on use)
    retrieveShift();
    populatePotentialWorkersAndSelected();
  }

  // Updates the user objects by clearing all people assigned to the shift
  const updateUserObjects = async () => {
    // hoursAssigned
    // clear prior
    if (shiftObject !== undefined && selectedRows.length <= shiftObject.numOfPeople) {
      // Decreases hours assigned for all of the workers who are assigned, but not included in the selected rows list (they were removed)
      for (let i = 0; i < potentialWorkers.length; i++) {
        let user = potentialWorkers[i];
        if (user.shiftsAssigned.includes(shiftID) && !selectedRows.includes(user.userID)) {
          let copy = [...user.shiftsAssigned];
          let index = copy.indexOf(shiftID);
          copy.splice(index, 1);
          let newHours = user.hoursAssigned;
          if (shiftObject !== undefined) {
            newHours -= shiftObject.hours;
          }
          let newData = {
              shiftsAssigned: copy,
              hoursAssigned: newHours
          }
          await updateUser(user.userID, newData);
        }
      }
      for (let i = 0; i < selectedRows.length; i++) {
        let userID = selectedRows[i];
        const user = await getUser(userID);
        if (user === null || user.shiftsAssigned.includes(shiftID)) {
          continue;
        }
        let copy = [...user.shiftsAssigned];
        copy.push(shiftID);
        let newHours = user.hoursAssigned;
        if (shiftObject !== undefined) {
          newHours += shiftObject.hours;
        }
        let newData = {
            shiftsAssigned: copy,
            hoursAssigned: newHours
        }
        await updateUser(userID, newData);
      }
    } else {
      // replace w modal
      console.log("Too many people selected");
    }
  }

  // Updates the shiftObject with the assigned day and the people assigned to that shift
  // If 0 selected rows, reset day to ""
  const updateShiftObject = async () => {
    if (shiftObject !== undefined && selectedRows.length <= shiftObject.numOfPeople) {
      let assignedDay = day;
      if (selectedRows.length == 0) {
        assignedDay = "";
      }
      let newData = {
        usersAssigned: selectedRows,
        assignedDay: assignedDay
      }
      await updateShift(houseID, shiftID, newData);
    }
  }
  
  return (
    <div className={styles.container}>
      <h3>{shiftObject?.name}</h3>
      <div id = "shiftAssignmentHeaderFlex">
        <div className = "shiftAssignmentHeaderEntry">
          {shiftObject && pluralizeHours(shiftObject.hours)}
        </div>
        <div className = "shiftAssignmentHeaderEntry">
          {day}
        </div>
        <div className = "shiftAssignmentHeaderEntry">
          {shiftObject && convertTimeWindowToTime(shiftObject.timeWindow[0], shiftObject.timeWindow[1])}
        </div>
        <div className = "shiftAssignmentHeaderEntry">
          {shiftObject && pluralizeHours(shiftObject.verificationBuffer)}
        </div>
        <div className = "shiftAssignmentHeaderEntry">
          {shiftObject && shiftObject.category}
        </div>
      </div>
      <ShiftAssignmentTable users = {potentialWorkers} shiftID = {shiftID} selectedRows = {selectedRows} setSelectedRows = {setSelectedRows}/>
      <Button onClick = {updateUserAndShiftObjects}>Assign</Button>
    </div>
  );
};

export default ShiftAssignmentComponentCard;
