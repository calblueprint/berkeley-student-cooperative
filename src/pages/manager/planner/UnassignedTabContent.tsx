import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import UnassignedShiftList from '../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
import { getAllShifts } from '../../../firebase/queries/shift'
import { HeadCell, Shift } from '../../../interfaces/interfaces'

const headCells: HeadCell<Shift>[] = [
  {
    id: 'name',
    isNumeric: false,
    label: 'Shift Name',
    isSortable: true,
  },
  {
    id: 'timeWindowDisplay',
    isNumeric: false,
    label: 'Time',
    isSortable: false,
  },
  {
    id: 'hours',
    isNumeric: true,
    label: 'Value',
    isSortable: true,
  },
]

const filters = [
  'all',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const UnassignedTabContent = () => {
  const { house } = useUserContext()

  const [shifts, setShifts] = useState<Shift[] | undefined>([])
  const [displayShifts, setDisplayShifts] = useState<Shift[] | undefined>(
    shifts
  )
  const [filterBy, setFilterBy] = useState<string>(filters[0])

  function formatMilitaryTime(militaryTime: number): string {
    const hour = Math.floor(militaryTime / 100)
    const minute = militaryTime % 100
    const isPM = hour >= 12

    // Convert hour to 12-hour format
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12

    // Add leading zero to minute if needed
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`

    // Add AM/PM indicator
    const ampm = isPM ? 'PM' : 'AM'

    // Return formatted time string
    return `${formattedHour}:${formattedMinute}${ampm}`
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setFilterBy(event.target.value)
  }

  // runs when the component mounts and when the house changes
  // ALL the shifts (unfiltered)
  useEffect(() => {
    async function fetchShifts() {
      const response = await getAllShifts(house.houseID)
      if (!response) {
        setShifts([])
      } else {
        // format data here before setting the data (in this case, shifts)
        setShifts(
          response
            .filter((shift) => {
              return shift.usersAssigned?.length == 0
            })
            .map((shift) => {
              const time1 = formatMilitaryTime(shift.timeWindow[0])
              const time2 = formatMilitaryTime(shift.timeWindow[1])
              shift.timeWindowDisplay = time1 + ' - ' + time2
              return shift
            })
        )
      }
    }
    fetchShifts()
  }, [house])

  // runs when the component mounts and when filterBy or shifts changes
  // the filtered shifts (filtered by day)
  useEffect(() => {
    setDisplayShifts(
      filterBy === filters[0]
        ? shifts
        : shifts?.filter((shift) =>
            shift.possibleDays
              .map((day) => day.toLocaleLowerCase())
              .includes(filterBy)
          )
    )
  }, [filterBy, shifts])

  return (
    <>
      {/* <UnassignedShiftList /> */}
      <Select value={filterBy} onChange={handleFilterChange}>
        {filters.map((day) => (
          <MenuItem key={day} value={day}>
            {day}
          </MenuItem>
        ))}
      </Select>
      <SortedTable
        data={displayShifts}
        headCells={headCells}
        isCheckable={false}
      />
    </>
  )
}
