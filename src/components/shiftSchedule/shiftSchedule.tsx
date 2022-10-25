/*
    1. House everything in shiftSchedule component (MUI Table)
  2. Have overview table that has shiftname, status, time, etc
      1. To get num shifts, just take len # of shifts.  For members needed to verify.  Take a sum of num ppl needed to do every shift, take a sum of verified shifts.  subtract num ppl - num shifts
  3. authUser (user context)  to get House, get the House Schedule (map <k: days, v: list of Shift ids>)  (useState??? probably not bc it’s static)
  4. Dropdown to select M-F (using useStates) (on change, change day useState + load in new list of shift ids from House Schedule)
  5. From d.o.w in house schedule, have a dailyShiftIDs list usestate (dependent on current day)
  6. Have a loop thru dailyShiftIDs, run loadShiftRow() on each id
  7. loadShiftRow() - Take an ID, retrieve corresponding shift from FB, load its name, time, and status into a shiftCell component (housed in an MUI table cell for convenience)

    Method 1:  get schedule, load in shifts when switching Days tab.
*/
import React, {useEffect, useState} from "react";
import { useAuth, } from "../../firebase/queries/auth";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { getUser } from "../../firebase/queries/user";
import { getHouse } from "../../firebase/queries/houseQueries";
import { Day } from "../../types/schema";
import { getNumVerified, getShift } from "../../firebase/queries/shift";
import ShiftRow from "./ShiftRow/shiftRow";
import { Shift } from "../../types/schema";
import { type } from "os";


// MAKE A GETALLHOUSESHIFTS QUERY
export const ShiftSchedule = () => {

  //User obj from FB
  const { authUser } = useAuth();
  const [shiftCells, setShiftCells] = useState([]);
  const [day, setDay] = useState(Day.Mon);
  const schedule = new Map<string, [number, Shift][]>();  

  const loadScheduleFromFB = async(): Promise<void> => {
    let houseFB = await getHouse(authUser.houseID);
    houseFB.schedule.forEach((shiftIDs, day) => {
      let dailyShiftsFB: [number, Shift][] = [];
      shiftIDs.map(async (shiftID) => {
        let shiftFB = await getShift(authUser.houseID, shiftID);
        let numVerified = await getNumVerified(authUser.houseID, shiftID);
        if (shiftFB != null) {
          dailyShiftsFB.push([numVerified, shiftFB]);
        } 
      })
      schedule.set(day, dailyShiftsFB);
    })
  }

  const t = schedule.get(day)?.at(1)
  useEffect(()=> {
    loadScheduleFromFB();
  })

  const [dailyShifts, setDailyShifts] = useState<[number, Shift][]>(schedule.get(day) || []);


  const loadShiftRow = (shiftTuple: [number, Shift]) => {
    const shiftFB = shiftTuple.at(1);
    const numVerified  = Number(shiftTuple.at(0));
    if (shiftFB != null && typeof(shiftFB) == "object") {
      return (
        <ShiftRow
         shiftName={shiftFB.shiftID}
         timeWindow={shiftFB.timeWindow}
         numOfPpl={shiftFB.numOfPeople}
         numVerified={numVerified}/>
      )
    }
  }
  



  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Shift name</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {}
          {dailyShifts.map((shiftTuple: [number, Shift])=> (loadShiftRow(shiftTuple)))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ShiftSchedule;


