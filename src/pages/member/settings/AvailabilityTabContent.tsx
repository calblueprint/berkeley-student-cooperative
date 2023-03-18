import { Button } from '@mui/material'
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
    const [showModal, setShowModal] = useState(false);

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

    // Button and deleteAvailabilityRow
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
        let index = entityIDs.indexOf(id, 0);
        if (index > -1) {
            entityIDs.splice(index, 1);
        }
    }

    const showNewAvailabilityModal = () => {
        setShowModal(!showModal);
    }

    return (
        <div>
            <div className = {styles.float}>
                <Button onClick = {showNewAvailabilityModal}>Reset Availability</Button>
                <Button onClick = {showNewAvailabilityModal}>New Availability</Button>
            </div>
            <div>
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
            </div>
            {/* probably some Dialog thing */}
            {showModal &&
                <div> 
                    hello 
                </div>   
            }
        </div>
    )
}

export default AvailabilityTabContent

// must link to some page
// also must put it in the tab view like in other views