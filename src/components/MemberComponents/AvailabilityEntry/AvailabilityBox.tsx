import { useEffect, useState } from 'react';
import styles from './AvailabilityEntry.module.css';

type AvailabilityBoxProps = {
    stringKey: string,
    numericKey: number[],
    day: string,
    isSelected: boolean,
    assignedMap: Map<string, number[]>
}

const AvailabilityBox: React.FC<AvailabilityBoxProps> = ({stringKey, numericKey, day, isSelected, assignedMap}: AvailabilityBoxProps) => {
    /**
     * An individual box that is displayed when users input their
     * availabilities. Created from AvailabilityTableInput.tsx.
     * 
     * @param stringKey - The string representation of the time window that this box represents
     * @param numericKey - The numeric representation of the time window that this box represents ([x, y] means the time window is x-y)
     * @param day - The day that the time window of this box represents.
     * @param isSelected - Boolean indicating whether someone is available
     * @param assignedMap - A map that maps days to time windows when people are available
     * @returns AvailabilityBox
     */
    const [selected, setSelected] = useState<boolean>();
    
    // Initializes whether the box is selected + adds it to the availabilityMap if they're available
    useEffect(() => {
        setSelected(isSelected);
        if (isSelected) {
            addToMap();
        }
    }, [isSelected, day]);

    // Toggles the selection and edits the map as needed
    const toggleSelected = () => {
        if (!selected) {
            addToMap();
        }
        if (selected) {
            removeFromMap();
        }
        setSelected(!selected);
    }

    // Removes this time window from the map
    const removeFromMap = () => {
        let retrieve = assignedMap.get(day);
        let keyStart = numericKey[0];
        let keyEnd = numericKey[1];
        if (retrieve !== undefined) {
            let toSplice = -1;
            for (let i = 0; i < retrieve.length; i += 2) {
                let start = retrieve[i];
                let end = retrieve[i + 1];
                if (start == keyStart && keyEnd == end) {
                    toSplice = i;
                    break;
                }
            }
            if (toSplice !== -1) {
                retrieve.splice(toSplice, 2);
            }
            assignedMap.set(day, retrieve);
        }
    }

    // Adds this time window to the map
    const addToMap = () => {
        let retrieve = assignedMap.get(day);
        let keyStart = numericKey[0];
        let keyEnd = numericKey[1];
        if (retrieve !== undefined) {
            let included = false;
            for (let i = 0; i < retrieve.length; i += 2) {
                let start = retrieve[i];
                let end = retrieve[i + 1];
                if (start == keyStart && keyEnd == end) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                retrieve.push(keyStart);
                retrieve.push(keyEnd);
            }
            assignedMap.set(day, retrieve);
        }
    }

    return (
        <div className = {styles.availabilityBox} onMouseDown = {toggleSelected} style = {{backgroundColor: selected ? 'green' : 'white'}}>
            {stringKey}
        </div>
    )
}

export default AvailabilityBox;