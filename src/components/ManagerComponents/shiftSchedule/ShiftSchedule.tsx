

/*
  Gives Shift Schedule view of current house.  Each row displays information about a given shift.
  Clicking on shift makes modal appear (AssignShiftCard), that allows Manager to assign user to given task.
  TODO:
  1. Connect Modal to each row (redesign how shiftRows are generated);
  2. Send shift Info to each row (just in case??)
  3. Change how House is retrieved using new Danashi User Context. (Functional for now)
  4. Have each ASC reach to firebase to retrieve users and be able to filter (later sprint task??, check later)
  5. styling
*/
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { getUser } from "../../../firebase/queries/user";
import { getHouse } from "../../../firebase/queries/houseQueries";
import { Day } from "../../../types/schema";
import { getNumVerified, getShift } from "../../../firebase/queries/shift";
import { Shift } from "../../../types/schema";
import { type } from "os";
import Select from "react-select";
import { firestoreAutoId, objectToMap } from "../../../firebase/helpers";
import Paper from '@mui/material/Paper';
import { useUserContext } from "../../../context/UserContext";



/*
  Flow
  1. useEffect calls loadScheduleComponents
  2. Retrieve the House's schedule
  3. For each entry in schedule, use list of shiftIDs to retrieve shifts from Firebase
  4. Turn Shift objects into rowData
  5. use rowData to create a table entry
  6. In schedule, store table entries in based on which day they're from.
*/
export const ShiftSchedule = () => {
  const { authUser } = useUserContext();

  /* MOST IMPORTANT:  Holds the row components that are loaded onto the table
  Each k: Days, value: List of corresponding components matching a given shift*/
  const [schedule, setSchedule] = useState(new Map<string, JSX.Element[]>());

  // For React Select, all options in dropdown (FRONTEND)
  const dayOptions = [
    { value: "Monday", label: "Monday"},
    { value: "Tuesday", label: "Tuesday"},
    { value: "Wednesday", label: "Wednesday"},
    { value: "Thursday", label: "Thursday"},
    { value: "Friday", label: "Friday"},
    { value: "Saturday", label: "Saturday"},
    { value: "Sunday", label: "Sunday"}
  ];

  // For React Select, to dispay Day on dropdown (FRONTEND)
  const [selectedDay, setSelectedDay] = useState<ValueType<OptionType>>(dayOptions[0]);
  const handleDayChange = (option: ValueType<any>) => {
    setSelectedDay(option);
    setDailyRows(schedule.get(option.value));
  };

  //Data used to generate a Shift Row Component in React (FRONTEND)
  type rowData = {
    name: string;
    shiftID: string;
    // Converted Time Window to a String
    timeWindow: string,
    status: string;
  }

  //The Rows that populate the table.  Will change depending on what dropdown day we pick (FRONTEND)
  const [dailyRows, setDailyRows] = useState<JSX.Element[]>();

  /* Function used to retrieve ALL shifts of a house at once.  
    Loads FB data and creates Row Components to display on MUI Table
    (BACKEND -> FRONTEND) */
  const loadScheduleComponents= async () => {
    let houseFB = await getHouse(authUser.houseID);
    let tempSchedule = new Map<string, JSX.Element[]>();
    //Promise All is important here because we need all Data to be loaded in before setting schedule again.
    //houseFB.Schedule contains the FB schedule.
    Promise.all(Object.entries((houseFB.schedule)).map(async (entry) => {
      let day = entry[0], shiftIDs = entry[1];
      //getDailyData converts all Firebase Shifts to row Data, only retrieves essential info for a row
      let dailyData: rowData[] = await getDailyData(day, shiftIDs);
      let rowComponents: JSX.Element[] = [];
      //Turn all row Data into Row Components
      convertDataToComponent(dailyData, rowComponents);
      tempSchedule.set(day, rowComponents);
    })).then(() => {
      //By Default, day is monday.
      setDailyRows(tempSchedule.get(Day.Mon));
      //Use Dummy Schedule to update the schedule useState
      setSchedule(tempSchedule);
    });
  }

  /* 
    Takes shift IDs, retrives Shifts from Firebase, then converts them all to rowData
    which are used to create components.
    day - Current Day
    shiftIDs - List of shift IDs corresponding to shifts from Current Day.
  */
  const getDailyData = async (day: string, shiftIDs: string[]): Promise<rowData[]> => {
      // May be a redundant line.
      if (shiftIDs == undefined) {
        return new Array<rowData>;
      }
      
      let shiftPromises: Promise<Shift | undefined>[] = [];
      shiftIDs.map((id) => {
        shiftPromises.push(getShift(authUser.houseID, id));
      })
      //MUST use Promise.all to assure that ALL shifts are loaded in before any loading is done.
      let shiftObjects = await Promise.all(shiftPromises);
      let numVerifiedPromises: Promise<number | undefined>[] = [];
      //Number Verified is retrieved differently since it's a collection.
      shiftObjects.map((shift) => {
        if (shift != undefined) {
          numVerifiedPromises.push(getNumVerified(authUser.houseID, shift.shiftID));
        }
      })
      let numVerifiedList =  await Promise.all(numVerifiedPromises);
      let rowObjects: rowData[] = []; 
      shiftObjects.map((shift, index) => {
        let numVerified = numVerifiedList[index];
        if (shift != undefined && numVerified != undefined) {
          /*
          Since verified shifts aren't set up in firebase, 
          can put random numbers in numVerified to test that status bar works 
          */
          let rowObject = createRowData(shift, numVerified); 
          rowObjects.push(rowObject);
        }
      })
      return rowObjects;
    }

  /*
    Converts Firebase Shift Object into rowData object 
    shiftFB - Firebase Shift Object
    numVerified - Number of verified shifts
   */
  const createRowData = (shiftFB: Shift, numVerified: number): rowData => {
    var status = "Missing";
    if (shiftFB.numOfPeople > numVerified){
      status = "Incomplete";
    } else if (shiftFB.numOfPeople <= numVerified){
      status = "Complete";
    }
    //May be helpful in helper file.
    //Converts a time from Firebase object and makes it legible.
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
        hours = timeString.slice(0, 2);
      } else {
        hours = timeString.slice(0, 1);
      }
      let minutes = timeString.slice(-2);
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

  /*
    Takes rowData and creates a JSX Component for it, the final table row
    dailyData - List of rowData from a given day
    rowComponents - List of row components that we push to
  */
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


