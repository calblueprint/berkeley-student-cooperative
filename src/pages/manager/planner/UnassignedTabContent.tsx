import { MenuItem, Select } from '@mui/material'
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
    id: 'timeWindow',
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

  useEffect(() => {
    async function fetchShifts() {
      const response = await getAllShifts(house.houseID)
      if (!response) {
        setShifts([])
      } else {
        // format data here before setting the data (in this case, shifts)
        setShifts(response)
      }
    }
    fetchShifts()
  }, [house])

  useEffect(() => {}, [filterBy])

  return (
    <>
      <UnassignedShiftList />
      <Select value={setFilterBy} onChange={handleFilterBy}>
        {filters.map((day) => (
          <MenuItem key={day} value={day}>
            {day}
          </MenuItem>
        ))}
      </Select>
      <SortedTable data={shifts} headCells={headCells} isCheckable={false} />
    </>
  )
}
