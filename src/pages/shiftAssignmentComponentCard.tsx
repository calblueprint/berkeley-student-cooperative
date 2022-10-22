import { useState } from "react";
import styles from "../styles/Home.module.css";
// task information
// query members and map info into table
import { getShift } from "../firebase/queries/shift";
import { User, Shift, House } from "../types/schema";
import { useEffect } from "react";
import { getHouse } from "../firebase/queries/house";
import { getUser } from "../firebase/queries/user";
import DataGrid from '@mui/material/Button';
import ShiftAssignmentTable from "./shiftAssignmentTable";

// name: string;
//   shiftID: string;
//   description: string;
//   possibleDays: string[];
//   numOfPeople: number;
//   // time 
//   timeWindow: number[];
//   assignedDay: string;
//   hours: number;
//   // number of hours since end time that you are allowed to verify
//   verificationBuffer: number;
//   usersAssigned: string[];
//   category: string;

type ShiftAssignmentComponentCardProps = {
  day: string,
  houseID: string,
  shiftID: string
}

const ShiftAssignmentComponentCard: React.FC<ShiftAssignmentComponentCardProps> = ({day, houseID, shiftID}: ShiftAssignmentComponentCardProps) => {
  const [shiftObject, setShiftObject] = useState<Shift>();
  const [potentialWorkers, setPotentialWorkers] = useState<User[]>([]);

  const retrieveShift = async () => {
    const shift = await getShift(houseID, shiftID);
    if (shift != null) {
      setShiftObject(shift);
    }
  }
  
  const populatePotentialWorkers = async () => {
    const tempShiftObject = await getShift(houseID, shiftID);
    if (tempShiftObject === null || tempShiftObject === undefined) {
      return;
    }
    const timeWindow = tempShiftObject.timeWindow;
    const shiftStart = timeWindow[0];
    const shiftEnd = timeWindow[1];
    const numHours = tempShiftObject.hours;
    const potentialUsers = [];
    const house = await getHouse(houseID);
    const totalUsersInHouse = house.members;
    if (totalUsersInHouse === null || totalUsersInHouse === undefined) {
      return;
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
    potentialUsers.sort((user1, user2) => {
      // First sort on hoursRemainingWeek, prioritizing people with higher hours remaining
      let hoursWeekDiff = user2.hoursRemainingWeek - user1.hoursRemainingWeek;
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
  }

  useEffect(() => {
    retrieveShift();
    populatePotentialWorkers();
  }, []);
  
  return (
    <div className={styles.container}>
      <div>
        Name: {shiftObject?.name}
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
      <ShiftAssignmentTable users = {potentialWorkers} shiftID = {shiftID}/>
      {/* {potentialWorkers.map((user, index) => (
        <div key = {index}> {user.name}</div>
      ))} */}
    </div>
  );
};

export default ShiftAssignmentComponentCard;
