
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
// import ShiftRow from "./ShiftRow/shiftRow";
import { Shift } from "../../types/schema";
import { type } from "os";
import Select from "react-select";
import { firestoreAutoId, objectToMap } from "../../firebase/helpers";
import Paper from '@mui/material/Paper';



// MAKE A GETALLHOUSESHIFTS QUERY
//CHANGE THIS ONCE U GET DANASHI's HOUSE CONTEXT
//New approach:  Create the shift components ON useEffect.  Just select these as u go thru
export const ShiftSchedule = () => {

  //User obj from FB
  const { authUser } = useAuth();
  const [day, setDay] = useState(Day.Mon);
  var schedule = new Map<string, JSX.Element[]>();  
  const dayOptions = [
    { value: "Monday", label: "Monday"},
    { value: "Tuesday", label: "Tuesday"},
    { value: "Wednesday", label: "Wednesday"},
    { value: "Thursday", label: "Thursday"},
    { value: "Friday", label: "Friday"},
    { value: "Saturday", label: "Saturday"},
    { value: "Sunday", label: "Sunday"}
  ];
  //Has additional data that could be useful in View task.
  type rowData = {
    name: string;
    shiftID: string;
    // time 
    timeWindow: string, //convert time window to
    // number of hours since end time that you are allowed to verify
    status: string;
  }
  const [dailyRows, setDailyRows] = useState<JSX.Element[]>();

  const loadScheduleComponents= async () => {
    let houseFB = await getHouse(authUser.houseID);
    Object.entries((houseFB.schedule)).map(async (entry) => {
      let day = entry[0], shiftIDs = entry[1];
      let dailyData: rowData[] = await getDailyData(day, shiftIDs);
      console.log({dailyData: dailyData});
      console.log({DailyData: dailyData, entry0: entry[0], entry1: entry[1]});
      let rowComponents: JSX.Element[] = [];
      convertDataToComponent(dailyData, rowComponents);
      schedule.set(day, rowComponents);
      if (day == Day.Mon) {
        setDailyRows(schedule.get(day));
      }
      console.log({schedule: schedule, dailyRows: dailyRows});
    });
  }

  const getDailyData = async (day: string, shiftIDs: string[]): Promise<rowData[]> => {
      if (shiftIDs == undefined) {
        return new Array<rowData>;
      }
      let shiftPromises: Promise<Shift | undefined>[] = []; //have something
      shiftIDs.map((id) => {
        shiftPromises.push(getShift(authUser.houseID, id));
      })
      let shiftObjects = await Promise.all(shiftPromises);
      let numVerifiedPromises: Promise<number | undefined>[] = [];
      shiftObjects.map((shift, index) => {
        if (shift != undefined) {
          numVerifiedPromises[index] = getNumVerified(authUser.houseID, shift.shiftID);
        }
      })
      console.log({numVerifiedPromises: numVerifiedPromises});
      let numVerifiedList =  await Promise.all(numVerifiedPromises);
      let rowObjects: rowData[] = []; 
      console.log({DAY: day, shiftObjects: shiftObjects, numVerifiedList: numVerifiedList});
      shiftObjects.map((shift, index) => {
        let numVerified = numVerifiedList[index];
        if (shift != undefined && numVerified != undefined) {
          let rowObject = createRowData(shift, numVerified);
          rowObjects.push(rowObject);
        }
      })
      return rowObjects;
    }

  const createRowData = (shiftFB: Shift, numVerified: number): rowData => {
    var status = "Missing";
    if (shiftFB.numOfPeople > numVerified){
      status = "Incomplete";
    } else {
      status = "Complete";
    }
    //May be helpful in helper file.
    const parseTime = (time: number) => {
      let meridian = "AM";
      if (time > 1230) {
        time = time - 1200;
        meridian = "PM";
      } 
      let timeString = String(time);
      if (timeString.slice(-2) == "30") {
        return timeString.slice(0, 2) + ":" + timeString.slice(-2) + meridian; 
      }
      return timeString.slice(0, 2) + meridian; 
    }

    let startTime = parseTime(shiftFB.timeWindow[0]);
    let endTime = parseTime(shiftFB.timeWindow[1]);
    let timeWindow = startTime + " - " + endTime;
    return {
      name : shiftFB.name, 
      shiftID : shiftFB.shiftID, 
      timeWindow : timeWindow,
      status : status,
    }
  }

  const convertDataToComponent = async (dailyData: rowData[], rowComponents: JSX.Element[]) => {
    dailyData.map((data) => (
      rowComponents.push(
        <TableRow key={data.shiftID}>
          <TableCell component="th" scope="row">{data.name}</TableCell>
          <TableCell align="right">{data.timeWindow}</TableCell>
          <TableCell align="right">{data.status}</TableCell>
        </TableRow>
      )
    ))
    console.log({rowComp: rowComponents});
  }

  useEffect(()=> {
    loadScheduleComponents();
  }, [authUser])
 

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }


  const loadRow = () => {
    console.log({dailyRowsAtLoad: dailyRows });1
    if (dailyRows != undefined) {
      let dailyRow = dailyRows.at(0);
      return (
        <TableRow key={firestoreAutoId()}>
          <TableCell component="th" scope="row">
          </TableCell>
          <TableCell align="right">hi</TableCell>
          <TableCell align="right">bye</TableCell>
        </TableRow>
      )

    }

  } 

  if (dailyRows === undefined) {
    return <>Still loading...</>;
  } else {
    return (
      <div>
        {/* <Select
            options={dayOptions}
            onChange={(e: Day) => {setDay(e);}}
            defaultValue={String(day)}
          /> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Shift Name</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyRows}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      
    );
  }
}

export default ShiftSchedule;


