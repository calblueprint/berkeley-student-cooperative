import { getDialogUtilityClass } from "@mui/material";
import { useEffect, useState } from "react"
import internal from "stream";
import { days, allPossibleTimeWindows, convertTimeWindowToTime } from "../../../firebase/helpers";
import { getUser } from "../../../firebase/queries/user";
import { User } from "../../../types/schema";
import AvailabilityBox from "./AvailabilityBox";
import styles from './AvailabilityEntry.module.css';

type AvailabilityEntryProps = {
    userID: string,
    day: string,
    selectedDay: string
}

const AvailabilityEntry: React.FC<AvailabilityEntryProps> = ({userID, day, selectedDay}: AvailabilityEntryProps) => {
    const [user, setUser] = useState<User>();
    useEffect(() => {
        fetchUser();
    }, []);


    const fetchUser = async () => {
        let fetched = await getUser(userID);
        if (fetched === undefined || fetched === null) {
            return;
        }
        setUser(fetched);
    }

    const renderTable = (start: number, end: number) => {
        let totalRender: JSX.Element[] = [];
        let availabilities = user?.availabilities;
        for (let i = start; i < end; i += 2) {
            let start = allPossibleTimeWindows[i];
            let end = allPossibleTimeWindows[i + 1];
            let sel = false;
            if (availabilities !== undefined) {
                let availabilitiesForDay = availabilities.get(day);
                if (availabilitiesForDay !== undefined) {
                    for (let j = 0; j < availabilitiesForDay.length; j += 2) {
                        if (availabilitiesForDay[j] <= start && availabilitiesForDay[j + 1] >= end) {
                            sel = true;
                            break;
                        }
                    }
                }
            }
            let keyString = convertTimeWindowToTime(start, end);
            totalRender.push(<AvailabilityBox key = {keyString} stringKey= {keyString} numericKey = {[start, end]} day = {day} isSelected = {sel}/>)
        }
        return (
            <div className = {styles.column}>
                {totalRender}
            </div>
        );
    }

    return (
        <div className = {styles.rowTable} style = {{display: day === selectedDay ? 'flex' : 'none'}}>
            {renderTable(0, allPossibleTimeWindows.length / 2 + 1)}
            {renderTable(allPossibleTimeWindows.length / 2 + 1, allPossibleTimeWindows.length)}
        </div>
    )
}

export default AvailabilityEntry;