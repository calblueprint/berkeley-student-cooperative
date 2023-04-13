import { Box, Button, Grid, Stack } from '@mui/material'
import { Dictionary, EntityId } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { calculateHoursBetween, convertTimeWindowToTime, pluralizeHours } from '../../../firebase/helpers'
import { HeadCell } from '../../../interfaces/interfaces'
import { useUpdateUserMutation } from '../../../store/apiSlices/userApiSlice'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import { Shift, User } from '../../../types/schema'
import styles from './AvailabilityTabContent.module.css'
import { mergeMap } from '../../../firebase/helpers'
import AddAvailabilityForm from './AddAvailabilityForm'
import AddAvailabilityCard from './AddAvailabilityCard'

const headCells: HeadCell<AvailabilityDisplayObject & { [key in keyof AvailabilityDisplayObject]: string | number }>[] = [
    {
        id: "day",
        isNumeric: false,
        label: "Day",
        isSortable: false,
        align: 'left'
    },
    {
        id: "stringTimeWindow",
        isNumeric: false,
        label: "Time",
        isSortable: false,
        align: 'left'
    }, {
        id: "numHoursInWindow",
        isNumeric: true,
        label: "Length",
        isSortable: false,
        align: 'left'
    }
]

type AvailabilityDisplayObject = {
    day: string,
    stringTimeWindow: string,
    numHoursInWindow: number
}

const daysList = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

const AvailabilityTabContent = () => {

    const authUser = useSelector(selectCurrentUser) as User

    const [
        updateUser,
        {
          // isLoading: isLoadingUpdateShift,
          // isSuccess: isSuccessUpdateShift,
          // isError: isErrorUpdateShift,
          // error: errorUpdateShift,
        },
    ] = useUpdateUserMutation();

    const [entityIDs, setEntityIDs] = useState<EntityId[] | undefined>();
    const [entityDictionary, setEntityDictionary] = useState<Dictionary<AvailabilityDisplayObject>>();

    useEffect(() => {
        populateIDsAndDictionary();
    }, [])

    const populateIDsAndDictionary = () => {
        let availabilities = authUser.availabilities;
        let entityID = 0;
        let copyEntityID: EntityId[] = [];
        let copyEntityDictionary: Dictionary<AvailabilityDisplayObject> = {};
        let daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        for (let j = 0; j < daysInWeek.length; j++) {
            let day = daysInWeek[j];
            if (!(day in availabilities)) {
                continue;
            }
            const currArr = availabilities[day];
            console.log(day);
            for (let i = 0; i < currArr.length; i += 2){
                let start = currArr[i];
                let end = currArr[i + 1];
                let numHoursInWindow = calculateHoursBetween(start, end);
                let newAvailabilityDisplayObject = {
                    day: day,
                    stringTimeWindow: convertTimeWindowToTime(start, end),
                    numHoursInWindow: numHoursInWindow
                }
                console.log(newAvailabilityDisplayObject);
                copyEntityDictionary["" + entityID] = newAvailabilityDisplayObject;
                copyEntityID.push("" + entityID);
                entityID += 1;
            }
        }
        setEntityIDs(copyEntityID);
        setEntityDictionary(copyEntityDictionary);
    }

    const addAvailability = async (startTime: number, endTime: number, startDay: string, endDay: string) => {
        // only works for 1 day right now
        let dayOfWeekStart = daysList.indexOf(startDay);
        let dayOfWeekEnd = daysList.indexOf(endDay);
        for (let i = dayOfWeekStart; i < dayOfWeekEnd; i++) {
            let day = daysList[i];
            // TODO: UPDATE TO WORK FOR MULTIPLE DAYS
            // TODO: UPDATE FIND AVAILABLE USER CODE TO DO 59 NOT 30
        }
        let day = startDay;
        if (entityIDs === undefined || entityDictionary === undefined) {
            return;
        }
        let avail = Object.entries(authUser.availabilities);
        let tempAvailabilityMap: Map<string, number[]> = new Map<string, number[]>(avail);
        let availPerDay: number[] = tempAvailabilityMap.get(day);
        if (availPerDay === undefined) {
            availPerDay = [];
        } else {
            availPerDay = [...availPerDay];
        }
        availPerDay.push(startTime);
        availPerDay.push(endTime);
        tempAvailabilityMap.set(day, availPerDay);
        console.log(tempAvailabilityMap);
        let mergedMap = mergeMap(tempAvailabilityMap);
        let mapCopy = JSON.parse(JSON.stringify(Object.fromEntries(mergedMap)));
        let dataToUpdateUser = { data: {}, houseId: authUser.houseID, userId: authUser.id }
        dataToUpdateUser.data = {
            availabilities: mapCopy
        }
        // await updateUser(dataToUpdateUser)

        // auth user.availabilities must be updated
        // populateIDsAndDictionary();
    }

    // Button and deleteAvailabilityRow
    // Delete row entity ids and update the user's availability map in firebase using redux
    const deleteAvailabilityRow = async (event: React.MouseEvent<unknown>, id: string) => {
        if (entityIDs === undefined || entityDictionary === undefined) {
            return;
        }
        // Update the user object
        let displayObject: AvailabilityDisplayObject | undefined = entityDictionary[id];
        if (displayObject === undefined) {
            return;
        }
        // Deep copy the availability map and remove the corresponding time window
        let mapCopy = JSON.parse(JSON.stringify(authUser.availabilities));
        let arrDayAvailabilities = mapCopy[displayObject.day];
        for (let i = 0; i < arrDayAvailabilities.length; i += 2) {
            let start = arrDayAvailabilities[i];
            let end = arrDayAvailabilities[i + 1];
            let tempWindow = convertTimeWindowToTime(start, end);
            if (tempWindow === displayObject.stringTimeWindow) {
                arrDayAvailabilities.splice(i, 2);
                break;
            }
        }
        let dataToUpdateUser = { data: {}, houseId: authUser.houseID, userId: authUser.id }
        dataToUpdateUser.data = {
            availabilities: mapCopy
        }
        await updateUser(dataToUpdateUser)

        // Removes the given id from the entity list
        let copyIDs = [...entityIDs];
        let index = copyIDs.indexOf(id, 0);
        if (index > -1) {
            copyIDs.splice(index, 1);
        }
        setEntityIDs(copyIDs);
    }
 
    // delete all of the entity ids and set the user availabilities to an empty dictionatry
    const resetAvailabilities = async () => {
        let mapCopy = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }
        let dataToUpdateUser = { data: {}, houseId: authUser.houseID, userId: authUser.id }
        dataToUpdateUser.data = {
            availabilities: mapCopy
        }
        // await updateUser(dataToUpdateUser)
        setEntityIDs([]);
        let copyEntityDictionary: Dictionary<AvailabilityDisplayObject> = {};
        setEntityDictionary(copyEntityDictionary);
    }
    // TODO pass in deleteAvailabilityRow and the delete button once the table is updated
    // TODO: For add availabiltiy, must update availability map in Firebase + update state w/ a new entity id and displayobject to the state 

    return (
        <Box>
            <Stack>            
                <Grid>
                    <AddAvailabilityCard addAvailability={addAvailability} resetAvailabilities = {resetAvailabilities} />
                </Grid>
                <Grid>
                    { entityIDs && entityDictionary && 
                        <SortedTable
                            ids = {entityIDs as EntityId[]}
                            entities = {entityDictionary as Dictionary<
                                AvailabilityDisplayObject & {[key in keyof AvailabilityDisplayObject]: string | number}
                                >}
                            headCells = {headCells}
                            isCheckable = {false}
                            isSortable = {true}
                        />
                    }
                </Grid>
            </Stack>
        </Box>
    )
}

export default AvailabilityTabContent