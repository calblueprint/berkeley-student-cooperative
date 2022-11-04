
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
  const [schedule, setSchedule] = useState(new Map<string, JSX.Element[]>());
  const dayOptions = [
    { value: "Monday", label: "Monday"},
    { value: "Tuesday", label: "Tuesday"},
    { value: "Wednesday", label: "Wednesday"},
    { value: "Thursday", label: "Thursday"},
    { value: "Friday", label: "Friday"},
    { value: "Saturday", label: "Saturday"},
    { value: "Sunday", label: "Sunday"}
  ];
  const [selectedDay, setSelectedDay] = useState<ValueType<OptionType>>(dayOptions[0]);
  const handleDayChange = (option: ValueType<any>) => {
    console.log({option: option});
    setSelectedDay(option);
    setDailyRows(schedule.get(option.value));
    console.log({optionvalue: option.value});
    console.log({selectedDay: selectedDay});
  };
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
    let tempSchedule = new Map<string, JSX.Element[]>();
    Promise.all(Object.entries((houseFB.schedule)).map(async (entry) => {
      let day = entry[0], shiftIDs = entry[1];
      let dailyData: rowData[] = await getDailyData(day, shiftIDs);
      let rowComponents: JSX.Element[] = [];
      convertDataToComponent(dailyData, rowComponents);
      tempSchedule.set(day, rowComponents);
    })).then(() => {
      setDailyRows(tempSchedule.get(Day.Mon));
      setSchedule(tempSchedule);
    });

    //Use set Schedule in this case.
    console.log({schedule: schedule});
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
      shiftObjects.map((shift) => {
        if (shift != undefined) {
          numVerifiedPromises.push(getNumVerified(authUser.houseID, shift.shiftID));
        }
      })
      let numVerifiedList =  await Promise.all(numVerifiedPromises);
      let rowObjects: rowData[] = []; 
      console.log({DAY: day, shiftObjects: shiftObjects, numVerifiedList: numVerifiedList});
      shiftObjects.map((shift, index) => {
        let numVerified = numVerifiedList[index];
        if (shift != undefined && numVerified != undefined) {
          let rowObject = createRowData(shift, 1);//temp
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
      if (time == 0) {
        return "12AM";
      }
      if (time > 1130) {
        meridian = "PM";
      }
      if (time > 1230) {
        time = time - 1200;
      } 
      let timeString = String(time);
      let hours;
      if (timeString.length > 3) {
        console.log({len3TString: timeString});
        hours = timeString.slice(0, 2);
      } else {
        hours = timeString.slice(0, 1);
      }
      let minutes = timeString.slice(-2);
      console.log({timeString: timeString, hours: hours, minutes: minutes});
      if (minutes == "30") {
        return hours + ":" + minutes + meridian; 
      }
      return hours + meridian; 
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
  }

  useEffect(()=> {
    loadScheduleComponents();
  }, [authUser])

  if (dailyRows === undefined) {
    return <>Still loading...</>;
  } else {
    return (
      <div>
        <Select
            value={selectedDay}
            options={dayOptions}
            onChange={option => handleDayChange(option)}
          />
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


