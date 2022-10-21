import { useState } from "react";
import styles from "../styles/Home.module.css";
// task information
// query members and map info into table
import { getShift } from "../firebase/queries/shift";
import { User, Shift } from "../types/schema";
import { useEffect } from "react";
import { getHouses } from "../firebase/queries/exampleQuery";

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

    let timeWindow = tempShiftObject.timeWindow;
    let numHours = tempShiftObject.hours;
    // hours * 100 -> add to userstart time and see if within
    let potentialUsers = [];
    // const house = await getHouse(houseID);
    // const totalUsersInHouse = house.users;
    // for (let i = 0; i < totalUsersInHouse.length; i++) {
    //   const currUser = totalUsersInHouse[i];
    //   const currAvailabilities = currUser.availabilities;
    //   if (currAvailabilities.has(day)) {
    //     const perDayAvailability = currAvailabilities.get(day);
    //     // compare time windows
    //   }
    // }
  }

  const [potentialWorkers, setPotentialWorkers] = useState<User[]>([]);

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
      {potentialWorkers.map((element, index) => (
        <div> {element.email}</div>
      ))}
    </div>
  );
};

export default ShiftAssignmentComponentCard;
