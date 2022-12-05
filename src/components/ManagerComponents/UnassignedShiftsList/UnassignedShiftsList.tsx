/*
  Gives Shift Schedule view of current house.  Each row displays information about a given shift.
  Clicking on shift makes modal appear (AssignShiftCard), that allows Manager to assign user to given task.
  TODO:
  1. Complete info in each Shift Card View (Future Sprint)
  2. Change how House is retrieved using new Danashi User Context. (Functional for now, plugging House context is a little buggy)
  3. styling
*/
import React, { useEffect, useState } from "react";
import {
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { getHouse } from "../../../firebase/queries/houseQueries";
import { Day } from "../../../types/schema";
import {
  getNumVerified,
  getShift,
  getAllShift,
} from "../../../firebase/queries/shift";
import { Shift } from "../../../types/schema";
// import Select from "react-select";
import Paper from "@mui/material/Paper";
import { useUserContext } from "../../../context/UserContext";
import AssignShiftcard from "../AssignShiftcard/AssignShiftcard";
import styles from "./UnassignedShiftsList.module.css";
import Icon from "../../../assets/Icon";
import ShiftCard from "../Shiftcard/Shiftcard";
/*
  Flow
  1. useEffect calls loadScheduleComponents
  2. Retrieve the House's schedule
  3. For each entry in schedule, use list of shiftIDs to retrieve shifts from Firebase
  4. Turn Shift objects into rowData
  5. use rowData to create a table entry
  6. In schedule, store table entries in based on which day they're from.
*/

export const UnassignedShiftList = () => {
  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  //Data used to generate a Shift Row Component in React (FRONTEND)
  type rowData = {
    name: string;
    shiftID: string;
    // Converted Time Window to a String
    timeWindow: string;
    hoursWorth: string;
  };

  const { authUser, house } = useUserContext();
  /* MOST IMPORTANT:  Holds the row components that are loaded onto the table
  Each k: Days, value: List of corresponding components matching a given shift*/
  const [schedule, setSchedule] = useState(new Map<string, JSX.Element[]>());

  /*
  This block of code handles the settings of the modal. 
  Table relies on 1 dynamic modal/MUI dialog, AssignShiftCard.
  Whenever card is opened, shiftID prop is changed for card so correct info pops up
  Every time open is pressed, new information is passed to make a card.
  */
  const [open, setOpen] = useState(false);

  // For React Select, to dispay Day on dropdown (FRONTEND)
  const [selectedDay, setSelectedDay] = useState<string>(dayOptions[0]);

  //The Rows that populate the table.  Will change depending on what dropdown day we pick (FRONTEND)
  const [dailyRows, setDailyRows] = useState<JSX.Element[]>();

  const handleOpen = (shiftID: string) => {
    setOpen(true);
    setCurrentShiftCardID(shiftID);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDayChange = (event: SelectChangeEvent) => {
    let day = event.target.value as string;
    setSelectedDay(event.target.value as string);
    console.log(day);
    setDailyRows([])
    setDailyRows(schedule.get(day));
  };

  /*
    Converts Firebase Shift Object into rowData object 
    shiftFB - Firebase Shift Object
   */
  const createRowData = (shiftFB: Shift): rowData => {
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
    };
    let startTime = parseTime(shiftFB.timeWindow[0]);
    let endTime = parseTime(shiftFB.timeWindow[1]);
    let timeWindow = startTime + " - " + endTime;
    let displayHours = "";
    if (shiftFB.hours == 1) {
      displayHours = " hour";
    } else {
      displayHours = " hours";
    }
    return {
      name: shiftFB.name,
      shiftID: shiftFB.shiftID,
      timeWindow: timeWindow,
      hoursWorth: String(shiftFB.hours) + displayHours,
    };
  };

  /*
    Takes rowData and creates a JSX Component for it, the final table row
    dailyData - List of rowData from a given day
    rowComponents - List of row components that we push to
  */
  const convertDataToComponent = (data: rowData) => {
    return (
      <TableRow
        key={data.shiftID}
        onClick={() => handleOpen(data.shiftID)}
        className={styles.tableRow}
      >
        <TableCell component="th" scope="row">
          {data.name}
        </TableCell>
        <TableCell align="right">{data.timeWindow}</TableCell>
        <TableCell align="right">{data.hoursWorth}</TableCell>
      </TableRow>
    );
  };

  const insertCompToSchedule = (day: string, rowShift: rowData) => {
    const comp = convertDataToComponent(rowShift);
    let tempSchedule = schedule;
    if (tempSchedule.has(day)) {
      let componetArray = tempSchedule.get(day);
      if (componetArray == undefined) {
        let componets: JSX.Element[] = [];
        componets.push(comp);
        tempSchedule.set(day, componets);
      } else {
        let insert = true;
        for (let i = 0; i < componetArray.length; i++) {
          if (comp.key == componetArray[i].key) {
            insert = false;
            break;
          }
        }
        if (insert) {
          componetArray.push(comp);
          tempSchedule.set(day, componetArray);
        }
      }
    } else {
      let componets: JSX.Element[] = [];
      componets.push(comp);
      tempSchedule.set(day, componets);
    }
    setSchedule(tempSchedule);
  };

  /* Function used to retrieve ALL shifts of a house at once.  
    Loads FB data and creates Row Components to display on MUI Table
    (BACKEND -> FRONTEND) */
  const loadScheduleComponents = async () => {
    let shifts = await getAllShift(authUser.houseID);
    // let shifts = shifts[]
    console.log(shifts);

    shifts
      .filter((shift) => {
        console.log(shift.numOfPeople != shift.usersAssigned.length);
        return shift.numOfPeople != shift.usersAssigned.length;
      })
      .forEach((shift) => {
        const rowShift = createRowData(shift);
        // const rowComponent = convertDataToComponent(rowShift);
        // if no shift has been assigned them add the componets to all posible days
        if (shift.usersAssigned.length == 0) {
          for (let i = 0; i < shift.possibleDays.length; i++) {
            let day = shift.possibleDays[i];
            insertCompToSchedule(day, rowShift);
          }
        } else {
          let day = shift.assignedDay;
          insertCompToSchedule(day, rowShift);
        }
      });
      console.log(schedule);
      setDailyRows(schedule.get(Day.Mon));
  };

  useEffect(() => {
    loadScheduleComponents();
  }, [authUser]);


  const searchBar = () => (
    <div className={styles.searchBar}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFFFF",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Icon type="search" />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );

  //ID that will be used for current Card modal.
  const [currentShiftCardID, setCurrentShiftCardID] = useState("");
  if (dailyRows === undefined) {
    return <>Still loading...</>;
  } else {
    return (
      <div>
        <div className={styles.flex}>
          {searchBar()}
          <div className={styles.flex2}>
            <Select
              value={selectedDay}
              onChange={handleDayChange}
              className={styles.daySelect}
            >
              {dayOptions.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
            <ShiftCard />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>SHIFT NAME</TableCell>
                <TableCell align="right">TIME</TableCell>
                <TableCell align="right">VALUE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{dailyRows}</TableBody>
          </Table>
        </TableContainer>
        <AssignShiftcard
          day={selectedDay}
          shiftID={currentShiftCardID}
          houseID={authUser.houseID}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      </div>
    );
  }
};


// export const UnassignedShiftList = () => {
//   const { authUser, house } = useUserContext();
//   /* MOST IMPORTANT:  Holds the row components that are loaded onto the table
//   Each k: Days, value: List of corresponding components matching a given shift*/
//   const [schedule, setSchedule] = useState(new Map<string, JSX.Element[]>());
//   /*
//   This block of code handles the settings of the modal.
//   Table relies on 1 dynamic modal/MUI dialog, AssignShiftCard.
//   Whenever card is opened, shiftID prop is changed for card so correct info pops up
//   Every time open is pressed, new information is passed to make a card.
//   */
//   const [open, setOpen] = useState(false);
//   const handleOpen = (shiftID: string) => {
//     setOpen(true);
//     setCurrentShiftCardID(shiftID);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const dayOptions = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];
//   // For React Select, to dispay Day on dropdown (FRONTEND)
//   const [selectedDay, setSelectedDay] = useState<string>(dayOptions[0]);
//   const handleDayChange = (event: SelectChangeEvent) => {
//     setSelectedDay(event.target.value as string);
//     setDailyRows(schedule.get(selectedDay));
//   };
//   //Data used to generate a Shift Row Component in React (FRONTEND)
//   type rowData = {
//     name: string;
//     shiftID: string;
//     // Converted Time Window to a String
//     timeWindow: string;
//     hoursWorth: string;
//   };
//   //The Rows that populate the table.  Will change depending on what dropdown day we pick (FRONTEND)
//   const [dailyRows, setDailyRows] = useState<JSX.Element[]>();

//   /* Function used to retrieve ALL shifts of a house at once.
//     Loads FB data and creates Row Components to display on MUI Table
//     (BACKEND -> FRONTEND) */
//   const loadScheduleComponents = async () => {
//     let houseFB = await getHouse(authUser.houseID);
//     let tempSchedule = new Map<string, JSX.Element[]>();
//     //Promise All is important here because we need all Data to be loaded in before setting schedule again.
//     //houseFB.Schedule contains the FB schedule.
//     Promise.all(
//       Object.entries(houseFB.schedule).map(async (entry) => {
//         let day = entry[0],
//           shiftIDs = entry[1];
//         //getDailyData converts all Firebase Shifts to row Data, only retrieves essential info for a row
//         let dailyData: rowData[] = await getDailyData(day, shiftIDs);
//         let rowComponents: JSX.Element[] = [];
//         //Turn all row Data into Row Components
//         convertDataToComponent(dailyData, rowComponents);
//         tempSchedule.set(day, rowComponents);
//       })
//     ).then(() => {
//       //By Default, day is monday.
//       setDailyRows(tempSchedule.get(Day.Mon));
//       //Use Dummy Schedule to update the schedule useState
//       setSchedule(tempSchedule);
//     });
//   };

//   /*
//     Takes shift IDs, retrives Shifts from Firebase, then converts them all to rowData
//     which are used to create components.
//     day - Current Day
//     shiftIDs - List of shift IDs corresponding to shifts from Current Day.
//   */
//   const getDailyData = async (
//     day: string,
//     shiftIDs: string[]
//   ): Promise<rowData[]> => {
//     // May be a redundant line.
//     if (shiftIDs == undefined) {
//       return new Array<rowData>();
//     }
//     let shiftPromises: Promise<Shift | undefined>[] = [];
//     setCurrentShiftCardID(shiftIDs[0]);
//     shiftIDs.map((id) => {
//       shiftPromises.push(getShift(authUser.houseID, id));
//     });
//     //MUST use Promise.all to assure that ALL shifts are loaded in before any loading is done.
//     let shiftObjects = await Promise.all(shiftPromises);
//     let rowObjects: rowData[] = [];
//     console.log("SHIFT OBJECT:");
//     console.log(shiftObjects);
//     shiftObjects.map((shift) => {
//       if (
//         shift != undefined &&
//         // If the number of people required for a shift has not been met, there are still unasigned
//         // shifts available.
//         shift.usersAssigned.length < shift.numOfPeople
//       ) {
//         let rowObject = createRowData(shift);
//         rowObjects.push(rowObject);
//       }
//     });
//     return rowObjects;
//   };

//   /*
//     Converts Firebase Shift Object into rowData object
//     shiftFB - Firebase Shift Object
//    */
//   const createRowData = (shiftFB: Shift): rowData => {
//     const parseTime = (time: number) => {
//       let meridian = "AM";
//       if (time == 0) {
//         return "12AM";
//       }
//       if (time > 1130) {
//         meridian = "PM";
//       }
//       if (time > 1230) {
//         time = time - 1200;
//       }
//       let timeString = String(time);
//       let hours;
//       if (timeString.length > 3) {
//         hours = timeString.slice(0, 2);
//       } else {
//         hours = timeString.slice(0, 1);
//       }
//       let minutes = timeString.slice(-2);
//       if (minutes == "30") {
//         return hours + ":" + minutes + meridian;
//       }
//       return hours + meridian;
//     };
//     let startTime = parseTime(shiftFB.timeWindow[0]);
//     let endTime = parseTime(shiftFB.timeWindow[1]);
//     let timeWindow = startTime + " - " + endTime;
//     let displayHours = "";
//     if (shiftFB.hours == 1) {
//       displayHours = " hour";
//     } else {
//       displayHours = " hours";
//     }
//     return {
//       name: shiftFB.name,
//       shiftID: shiftFB.shiftID,
//       timeWindow: timeWindow,
//       hoursWorth: String(shiftFB.hours) + displayHours,
//     };
//   };

//   /*
//     Takes rowData and creates a JSX Component for it, the final table row
//     dailyData - List of rowData from a given day
//     rowComponents - List of row components that we push to
//   */
//   const convertDataToComponent = async (
//     dailyData: rowData[],
//     rowComponents: JSX.Element[]
//   ) => {
//     dailyData.map((data) =>
//       rowComponents.push(
//         <TableRow
//           key={data.shiftID}
//           onClick={() => handleOpen(data.shiftID)}
//           className={styles.tableRow}
//         >
//           <TableCell component="th" scope="row">
//             {data.name}
//           </TableCell>
//           <TableCell align="right">{data.timeWindow}</TableCell>
//           <TableCell align="right">{data.hoursWorth}</TableCell>
//         </TableRow>
//       )
//     );
//   };

//   useEffect(() => {
//     loadScheduleComponents();
//   }, [authUser]);

//   const searchBar = () => (
//     <div className={styles.searchBar}>
//       <TextField
//         id="outlined-basic"
//         label="Search"
//         variant="outlined"
//         sx={{
//           width: "100%",
//           backgroundColor: "#FFFFFFFF",
//         }}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="start">
//               <Icon type="search" />
//             </InputAdornment>
//           ),
//         }}
//       />
//     </div>
//   );

//   //ID that will be used for current Card modal.
//   const [currentShiftCardID, setCurrentShiftCardID] = useState("");
//   if (dailyRows === undefined) {
//     return <>Still loading...</>;
//   } else {
//     return (
//       <div>
//         <div className={styles.flex}>
//           {searchBar()}
//           <div className={styles.flex2}>
//             <Select
//               value={selectedDay}
//               onChange={handleDayChange}
//               className={styles.daySelect}
//             >
//               {dayOptions.map((day) => (
//                 <MenuItem key={day} value={day}>
//                   {day}
//                 </MenuItem>
//               ))}
//             </Select>
//             <ShiftCard />
//           </div>
//         </div>

//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>SHIFT NAME</TableCell>
//                 <TableCell align="right">TIME</TableCell>
//                 <TableCell align="right">VALUE</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>{dailyRows}</TableBody>
//           </Table>
//         </TableContainer>
//         <AssignShiftcard
//           day={selectedDay}
//           shiftID={currentShiftCardID}
//           houseID={authUser.houseID}
//           open={open}
//           handleOpen={handleOpen}
//           handleClose={handleClose}
//         />
//       </div>
//     );
//   }
// };
export default UnassignedShiftList;
