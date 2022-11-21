import { useState } from "react";
import AvailabilityEntry from "./AvailabilityEntry";
import { days } from '../../../firebase/helpers';
import { Button } from "@mui/material";
import styles from './AvailabilityEntry.module.css';

type AvailabilityDaySelectionProps = {
    userID: string
}

const AvailabilityDaySelect: React.FC<AvailabilityDaySelectionProps> = ({userID}: AvailabilityDaySelectionProps) => {
    const [selectedDay, setSelectedDay] = useState<string>("Monday");

    const handleClick = (day: string) => {
        setSelectedDay(day);
    }

    const handleSubmit = () => {
        // get all availability boxes for a day in availability entry
        for (let i = 0; i < days.length; i++) {
            let day = days[i];
            
        }
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
                    <AvailabilityEntry userID = {userID} day = {day} selectedDay = {selectedDay}/>
                ))
            }
            <Button onClick = {handleSubmit}>Submit</Button>
        </div>
    )
}
export default AvailabilityDaySelect;