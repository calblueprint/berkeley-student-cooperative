import { useState } from "react";
import AvailabilityTableInput from "./AvailabilityEntry";
import { mergeMap, days, mapToObject } from '../../../firebase/helpers';
import { Button } from "@mui/material";
import styles from './AvailabilityEntry.module.css';
import { updateUser } from "../../../firebase/queries/user";

type AvailabilityInputModalProps = {
    userID: string
}

const AvailabilityInputModal: React.FC<AvailabilityInputModalProps> = ({userID}: AvailabilityInputModalProps) => {

    const initializeMap = () => {
        let m = new Map<string, number[]>();
        for (let i = 0; i < days.length; i++) {
            m.set(days[i], []);
        }
        return m;
    }

    const [selectedDay, setSelectedDay] = useState<string>("Monday");
    const [assignedMap, setAssignedMap] = useState<Map<string, number[]>>(initializeMap());

    const handleClick = (day: string) => {
        setSelectedDay(day);
    }

    const handleSubmit = async () => {
        let newMap = mergeMap(assignedMap);
        let newData = {
            availabilities: mapToObject(newMap)
        }
        await updateUser(userID, newData);
    }

    return (
        <div className = {styles.row}>
            <div className = {styles.column}>
                {days.map((day) => (
                    <Button key = {day} onClick = {() => handleClick(day)} style = {{backgroundColor: selectedDay === day ? 'tan' : 'white'}}> {day} </Button>
                ))}
            </div>
            {
                days.map((day) => (
                    <AvailabilityTableInput key = {day} userID = {userID} day = {day} selectedDay = {selectedDay} assignedMap = {assignedMap}/>
                ))
            }
            <Button onClick = {handleSubmit}>Save</Button>
        </div>
    )
}
export default AvailabilityInputModal;