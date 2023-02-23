/*
  Gives Shift Schedule view of current house.  Each row displays information about a given shift.
  Clicking on shift makes modal appear (AssignShiftCard), that allows Manager to assign user to given task.
  TODO:
  1. Complete info in each Shift Card View (Future Sprint)
  2. Change how House is retrieved using new Danashi User Context. (Functional for now, plugging House context is a little buggy)
  3. styling
*/
import { getUser } from '../../../firebase/queries/user'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { getHouse } from '../../../firebase/queries/houseQueries'
import { Day } from '../../../types/schema'
import { getNumVerified, getShift } from '../../../firebase/queries/shift'
import { Shift } from '../../../types/schema'
import { type } from 'os'
import Select from 'react-select'
import { firestoreAutoId, objectToMap } from '../../../firebase/helpers'
import Paper from '@mui/material/Paper'
import { useUserContext } from '../../../context/UserContext'
import ShiftCard from '../Shiftcard/Shiftcard'
import AssignShiftcard from '../AssignShiftcard/AssignShiftcard'
import styles from './ShiftSchedule.module.css'

/**
 * @remarks
 * Returns a table of all the shifts created for a given House.
 * House is retrieved using User context
 * Flow
 * 1. useEffect calls loadScheduleComponents
 * 2. Retrieve the House's schedule
 * 3. For each entry in schedule, use list of shiftIDs to retrieve shifts from Firebase
 * 4. Turn Shift objects into rowData
 * 5. use rowData to create a table entry
 * 6. In schedule, store table entries in based on which day they're from.
 */
export const ShiftSchedule = () => {
  const { authUser, house } = useUserContext()

  /* MOST IMPORTANT:  Holds the row components that are loaded onto the table
  Each k: Days, value: List of corresponding components matching a given shift*/
  const [schedule, setSchedule] = useState(new Map<string, JSX.Element[]>())

  /*
  This block of code handles the settings of the modal. 
  Table relies on 1 dynamic modal/MUI dialog, AssignShiftCard.
  Whenever card is opened, shiftID prop is changed for card so correct info pops up
  Every time open is pressed, new information is passed to make a card.
  */
  const [open, setOpen] = useState(false)
  /**
   * @remarks
   * Since we are using 1 modal that is dynamic, handleOpen changes the settings
   * of the modal upon clicking a row
   * @param shiftID - shiftID of the row being clicked.
   */
  const handleOpen = (shiftID: string) => {
    setOpen(true)
    setCurrentShiftCardID(shiftID)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // For React Select, all options in dropdown (FRONTEND)
  const dayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ]

  // For React Select, to dispay Day on dropdown (FRONTEND)
  const [selectedDay, setSelectedDay] = useState<ValueType<OptionType>>(
    dayOptions[0]
  )

  /**
   * @remarks
   * When changing the day in the dropdown, we change the selected Day AND
   * must rerender the table rows to fit that day
   * @param option - From dayOptions
   */
  const handleDayChange = (option: ValueType<any>) => {
    setSelectedDay(option)
    setDailyRows(schedule.get(option.value))
  }

  //Data used to generate a Shift Row Component in React (FRONTEND)
  type rowData = {
    name: string
    shiftID: string
    // Converted Time Window to a String
    timeWindow: string
    status: string
  }

  //The Rows that populate the table.  Will change depending on what dropdown day we pick (FRONTEND)
  const [dailyRows, setDailyRows] = useState<JSX.Element[]>()

  /**
   * @remarks
   * Retrieves all shifts of a house at once.
   * Loads the FB data and creates Row Components to display on MUI Table
   */
  const loadScheduleComponents = async () => {
    let houseFB = await getHouse(authUser.houseID)
    let tempSchedule = new Map<string, JSX.Element[]>()
    //Promise All is important here because we need all Data to be loaded in before setting schedule again.
    //houseFB.Schedule contains the FB schedule.
    Promise.all(
      Object.entries(houseFB.schedule).map(async (entry) => {
        let day = entry[0],
          shiftIDs = entry[1]
        //getDailyData converts all Firebase Shifts to row Data, only retrieves essential info for a row
        let dailyData: rowData[] = await getDailyData(day, shiftIDs)
        let rowComponents: JSX.Element[] = []
        //Turn all row Data into Row Components
        convertDataToComponent(dailyData, rowComponents)
        tempSchedule.set(day, rowComponents)
      })
    ).then(() => {
      //By Default, day is monday.
      setDailyRows(tempSchedule.get(Day.Mon))
      //Use Dummy Schedule to update the schedule useState
      setSchedule(tempSchedule)
    })
  }

  /**
   * Takes shift IDs, retrives Shifts from Firebase, then converts them all to rowData
   * which are used to create components.
   * @param day - Current Day
   * @param shiftIDs - List of shift IDs corresponding to shifts from Current Day.
   */
  const getDailyData = async (
    day: string,
    shiftIDs: string[]
  ): Promise<rowData[]> => {
    // May be a redundant line.
    if (shiftIDs == undefined) {
      return new Array<rowData>()
    }
    let shiftPromises: Promise<Shift | undefined>[] = []
    setCurrentShiftCardID(shiftIDs[0])
    shiftIDs.map((id) => {
      shiftPromises.push(getShift(authUser.houseID, id))
    })
    //MUST use Promise.all to assure that ALL shifts are loaded in before any loading is done.
    let shiftObjects = await Promise.all(shiftPromises)
    let numVerifiedPromises: Promise<number | undefined>[] = []
    //Number Verified is retrieved differently since it's a collection.
    shiftObjects.map((shift) => {
      if (shift != undefined) {
        numVerifiedPromises.push(
          getNumVerified(authUser.houseID, shift.shiftID)
        )
      }
    })
    let numVerifiedList = await Promise.all(numVerifiedPromises)
    let rowObjects: rowData[] = []
    shiftObjects.map((shift, index) => {
      let numVerified = numVerifiedList[index]
      if (shift != undefined && numVerified != undefined) {
        /**
         * Since verified shifts aren't set up in firebase,
         * can put random numbers in numVerified to test that status bar works
         * */
        let rowObject = createRowData(shift, numVerified)
        rowObjects.push(rowObject)
      }
    })
    return rowObjects
  }

  /**
   * @remarks
   * Converts Firebase Shift Object into rowData object
   * @param shiftFB - Firebase Shift Object
   * @param numVerified - Number of verified shifts
   */
  const createRowData = (shiftFB: Shift, numVerified: number): rowData => {
    var status
    if (numVerified == 0) {
      status = 'Missing'
    } else if (shiftFB.numOfPeople > numVerified) {
      status = 'Incomplete'
    } else {
      status = 'Complete'
    }
    //May be helpful in helper file.
    //Converts a time from Firebase object and makes it legible.
    const parseTime = (time: number) => {
      let meridian = 'AM'
      if (time == 0) {
        return '12AM'
      }
      if (time > 1130) {
        meridian = 'PM'
      }
      if (time > 1230) {
        time = time - 1200
      }
      let timeString = String(time)
      let hours
      if (timeString.length > 3) {
        hours = timeString.slice(0, 2)
      } else {
        hours = timeString.slice(0, 1)
      }
      let minutes = timeString.slice(-2)
      if (minutes == '30') {
        return hours + ':' + minutes + meridian
      }
      return hours + meridian
    }

    let startTime = parseTime(shiftFB.timeWindow[0])
    let endTime = parseTime(shiftFB.timeWindow[1])
    let timeWindow = startTime + ' - ' + endTime
    return {
      name: shiftFB.name,
      shiftID: shiftFB.shiftID,
      timeWindow: timeWindow,
      status: status,
    }
  }

  /**
   * @remarks
   *  Takes rowData and creates a JSX Component for it, the final table row
   * @param dailyData - List of rowData from a given day
   * @param rowComponents - List of row components that we push to
   */
  const convertDataToComponent = async (
    dailyData: rowData[],
    rowComponents: JSX.Element[]
  ) => {
    dailyData.map((data) =>
      rowComponents.push(
        <TableRow
          key={data.shiftID}
          onClick={() => handleOpen(data.shiftID)}
          className={styles.tableRow}
        >
          <TableCell component="th" scope="row">
            {data.name}
          </TableCell>
          <TableCell align="right">{data.timeWindow}</TableCell>
          <TableCell align="right">{data.status}</TableCell>
        </TableRow>
      )
    )
  }

  useEffect(() => {
    loadScheduleComponents()
  }, [authUser])

  //ID that will be used for current Card modal.
  const [currentShiftCardID, setCurrentShiftCardID] = useState('')

  if (dailyRows === undefined) {
    return <>Still loading...</>
  } else {
    return (
      <div>
        <Select
          value={selectedDay}
          options={dayOptions}
          onChange={(option) => handleDayChange(option)}
          className={styles.daySelect}
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
            <TableBody>{dailyRows}</TableBody>
          </Table>
        </TableContainer>
        <AssignShiftcard
          shiftID={currentShiftCardID}
          houseID={authUser.houseID}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      </div>
    )
  }
}

export default ShiftSchedule
