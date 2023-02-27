import { useState } from 'react'
import AvailabilityTableInput from './AvailabilityTableInput'
import { mergeMap, days, mapToObject } from '../../../firebase/helpers'
import { Button } from '@mui/material'
import styles from './AvailabilityEntry.module.css'
import { updateUser } from '../../../firebase/queries/user'

type AvailabilityInputModalProps = {
  userID: string
}

const AvailabilityInputModal: React.FC<AvailabilityInputModalProps> = ({
  userID,
}: AvailabilityInputModalProps) => {
  /**
   * The modal where users are able to input their availabilities.
   * Contains multiple AvailabilityTableInput.tsx objects.
   * @param userID - The userID
   * @returns AvailabilityInputModal
   */

  // Initializes the map
  const initializeMap = () => {
    let m = new Map<string, number[]>()
    for (let i = 0; i < days.length; i++) {
      m.set(days[i], [])
    }
    return m
  }

  // The day that the user has selected to input their availabilities for
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  // The map of days to time windows that the user is free. Updated whenever the user selects a box
  // indicating that they're free during that time.
  const [assignedMap, setAssignedMap] = useState<Map<string, number[]>>(
    initializeMap()
  )

  const handleClick = (day: string) => {
    setSelectedDay(day)
  }

  // Merges the time intervals that is present in the map using the mergeMap function from helpers.
  // Sends the updated availabilities to Firebase.
  const handleSubmit = async () => {
    let newMap = mergeMap(assignedMap)
    let newData = {
      availabilities: mapToObject(newMap),
    }
    await updateUser(userID, newData)
  }

  // Creates AvailabilityTableInput, 1 per day ofn the week.
  return (
    <div className={styles.row}>
      <div className={styles.column}>
        {days.map((day) => (
          <Button
            key={day}
            onClick={() => handleClick(day)}
            style={{ backgroundColor: selectedDay === day ? 'tan' : 'white' }}
          >
            {' '}
            {day}{' '}
          </Button>
        ))}
      </div>
      {days.map((day) => (
        <AvailabilityTableInput
          key={day}
          userID={userID}
          day={day}
          selectedDay={selectedDay}
          assignedMap={assignedMap}
        />
      ))}
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  )
}
export default AvailabilityInputModal
