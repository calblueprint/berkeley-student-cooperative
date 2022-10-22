import { useState } from "react";
import styles from "../styles/Home.module.css";
// task information
// query members and map info into table
import { getShift } from "../firebase/queries/shift";
import { User, Shift, House } from "../types/schema";
import { useEffect } from "react";
import { getHouse } from "../firebase/queries/house";
import { updateUser, getUser} from "../firebase/queries/user";
import ShiftAssignmentTable from "./shiftAssignmentTable";
import Button from "@mui/material/Button";
import { updateShift } from "../firebase/queries/shift";

type ShiftAssignmentComponentCardProps = {
  day: string,
  houseID: string,
  shiftID: string
}

const ShiftAssignmentComponentCard: React.FC<ShiftAssignmentComponentCardProps> = ({day, houseID, shiftID}: ShiftAssignmentComponentCardProps) => {
  const [shiftObject, setShiftObject] = useState<Shift>();
  const [potentialWorkers, setPotentialWorkers] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
// list of userIDs

  const retrieveShift = async () => {
    const shift = await getShift(houseID, shiftID);
    if (shift != null) {
      setShiftObject(shift);
    }
  }
  
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
      if (userObject.shiftsAssigned.includes(shiftID)) {
        potentialUsers.push(userObject);
        continue;
      }
      let assignableHours = userObject.hoursRequired - userObject.hoursAssigned;
      if (assignableHours <= 0) {
        continue;
      }
      const currAvailabilities = userObject.availabilities;
      if (currAvailabilities.has(day)) {
        const perDayAvailability = currAvailabilities.get(day);
        if (perDayAvailability === undefined) {
          continue;
        }
        for (let j = 0; j < perDayAvailability.length; j += 2) {
          let currStart = perDayAvailability[j];
          let permEnd = perDayAvailability[j + 1];
          
          if (permEnd < shiftStart) {
            continue;
          }
          currStart = Math.max(currStart, shiftStart);
          let newEnd = currStart + mult100 + thirtyMin;
          let requiredEnd = Math.min(permEnd, shiftEnd);
          if (newEnd <= requiredEnd) {
            potentialUsers.push(userObject);
            break;
          }
        }
      }
    }
    return potentialUsers;
  }
  const populatePotentialWorkersAndSelected = async () => {
    const tempShiftObject = await getShift(houseID, shiftID);
    if (tempShiftObject === null || tempShiftObject === undefined) {
      return;
    }
    let potentialUsers = await findAvailableUsers(tempShiftObject);

    potentialUsers.sort((user1, user2) => {
      // First sort on hoursRemainingWeek, prioritizing people with higher hours remaining
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
      // Second sort on preferences, prioritizing people with higher preferences
      let prefDiff = user2Pref - user1Pref;
      if (prefDiff != 0) {
        return prefDiff;
      }
      // Third sort on hoursRemainingSemester, prioritizing people with higher hoursRemaining
      return user2.hoursRemainingSemester - user1.hoursRemainingSemester;
    });
    setPotentialWorkers(potentialUsers);

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

  useEffect(() => {
    retrieveShift();
    populatePotentialWorkersAndSelected();
  }, []);

  const updateUserAndShiftObjects = async () => {
    await updateUserObjects();
    await updateShiftObject();
  }

  const updateUserObjects = async () => {
    // hoursAssigned
    // clear prior
    if (shiftObject !== undefined && selectedRows.length <= shiftObject.numOfPeople) {
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

      // add new
      for (let i = 0; i < selectedRows.length; i++) {
        let userID = selectedRows[i];
        const user = await getUser(userID);
        if (user === null || user.shiftsAssigned.includes(shiftID)) {
            return;
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

  const updateShiftObject = async () => {
    if (shiftObject !== undefined && selectedRows.length <= shiftObject.numOfPeople) {
      let newData = {
        usersAssigned: selectedRows,
        assignedDay: day
      }
      await updateShift(houseID, shiftID, newData);
    }
  }
  
  return (
    <div className={styles.container}>
      <h1>{shiftObject?.name}</h1>
      <div>
        {day}
      </div>
      <div>
        Description: {shiftObject?.description}
      </div>
      <div>
        Num People: {shiftObject?.numOfPeople}
      </div>
      <div>
        Time Window: {shiftObject?.timeWindow}
      </div>
      <div>
        Category: {shiftObject?.category}
      </div>
      <div>
        Possible Days: {shiftObject?.possibleDays}
      </div>
      <div>
        Hours: {shiftObject?.hours}
      </div>
      <div>
        Verification Buffer: {shiftObject?.verificationBuffer}
      </div>
      <div>
        Users Assigned: {shiftObject?.usersAssigned}
      </div>
      <ShiftAssignmentTable users = {potentialWorkers} shiftID = {shiftID} selectedRows = {selectedRows} setSelectedRows = {setSelectedRows}/>
      <Button onClick = {updateUserAndShiftObjects}>Assign</Button>
    </div>
  );
};

export default ShiftAssignmentComponentCard;
