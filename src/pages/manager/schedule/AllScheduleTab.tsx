import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import UnassignedShiftList from '../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
import { getAllShift, getNumVerified } from '../../../firebase/queries/shift'
import { HeadCell, Shift } from '../../../interfaces/interfaces'

//just have to give data, headcells, handle some type of row click.
//Use this to actually create the rows.
//A bit of an ugly solution to the typing.
//TODO: Move the status calculation to this table.
/**
 * 1. Headcell categories: name, time, value. status
 * 2. useEffect gets all shifts, formats them to fit front-end spec
 *    TODO: Uses the numVerified calculation used by old ShiftSchedule.  Deprecate if
 * 3. 2nd useEffect runs, takes those shifts displays based on day
 *
 * 4. Querying handled on this page
 * 5. Needs a view-shift card per row
 *
 * TODO: If adding a new type to the interface, have to add it to the schema.  Why do we need an interface if they're the same?
 * Ideas:
 * Could we use this as a base for the manager and member versions?
 * COuld we use this for both individual and all?
 * Query for all shifts by default, filter the same table based on member id later
 *
 */
//TODO: Consider adding STATUS to shift interface () & schema,

//TODO: If this version of headcells doesn't work, create a status? field on shift interface
const headCells: (HeadCell<Shift> | HeadCell<{ status: string }>)[] = [
  {
    id: 'name', //How it maps which info to go under each column.
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
  {
    id: 'status',
    isNumeric: false,
    label: 'Status',
    isSortable: false,
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

  const calculateStatus = async (shift: Shift): Promise<string> => {
    const numVerified = await getNumVerified(house.houseID, shift.shiftID)
    const numAssigned = shift.usersAssigned.length
    if (numVerified == 0) {
      return 'Missing'
    } else if (numAssigned > numVerified) {
      return 'Incomplete'
    } else {
      return 'Complete'
    }
  }

  // runs when the component mounts and when the house changes
  // ALL the shifts (unfiltered)
  useEffect(() => {
    async function fetchShifts() {
      const response = await getAllShift(house.houseID)
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
              calculateStatus(shift).then((status) => {})
              const time1 = formatMilitaryTime(shift.timeWindow[0])
              const time2 = formatMilitaryTime(shift.timeWindow[1])
              shift.timeWindowDisplay = time1 + ' - ' + time2
              shift.id = shift.shiftID
              shift.status = await calculateStatus(shift)
              return shift
            })
        )
      }
    }
    fetchShifts()
  }, [])

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

  /**
   *
   */
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
