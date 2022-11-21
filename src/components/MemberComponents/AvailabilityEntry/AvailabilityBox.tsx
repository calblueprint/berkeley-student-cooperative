import { useEffect, useState } from 'react';
import styles from './AvailabilityEntry.module.css';

type AvailabilityBoxProps = {
    stringKey: string,
    numericKey: number[],
    day: string,
    isSelected: boolean
}

const AvailabilityBox: React.FC<AvailabilityBoxProps> = ({stringKey, numericKey, day, isSelected}: AvailabilityBoxProps) => {
    const [selected, setSelected] = useState<boolean>();
    
    useEffect(() => {
        setSelected(isSelected);
    }, [isSelected, day]);

    const toggleSelected = () => {
        console.log(selected);
        console.log(isSelected);
        setSelected(!selected);
    }

    return (
        <div className = {styles.availabilityBox} onMouseDown = {toggleSelected} style = {{backgroundColor: selected ? 'green' : 'white'}}>
            {stringKey}
        </div>
    )
}

export default AvailabilityBox;