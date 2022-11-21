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
    const [selected, setSelected] = useState<boolean>();
    
    useEffect(() => {
        setSelected(isSelected);
        if (isSelected) {
            addToMap();
        }
    }, [isSelected, day]);

    const toggleSelected = () => {
        if (!selected) {
            addToMap();
        }
        if (selected) {
            removeFromMap();
        }
        setSelected(!selected);
    }

    const removeFromMap = () => {
        let retrieve = assignedMap.get(day);
        let keyStart = numericKey[0];
        let keyEnd = numericKey[1];
        if (retrieve !== undefined) {
            let included = false;
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