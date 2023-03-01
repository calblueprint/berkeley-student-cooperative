import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
// import UnassignedShiftList from '../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
// import { getAllShifts } from '../../../firebase/queries/shift'
import { HeadCell, Shift } from '../../../interfaces/interfaces'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'
import { EntityId, Dictionary } from '@reduxjs/toolkit'

const headCells: HeadCell<Shift & { [key in keyof Shift]: string | number }>[] =
  [
    {
      id: 'name',
      isNumeric: false,
      label: 'Shift Name',
      isSortable: true,
    },
    {
      id: 'timeWindowDisplay',
      isNumeric: true,
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
  const { data, isLoading, isSuccess, isError } = useGetShiftsQuery(
    house?.houseID
  )

  const [shifts, setShifts] = useState<EntityId[] | undefined>([])
  const [displayShifts, setDisplayShifts] = useState<EntityId[] | undefined>(
    shifts
  )
  const [filterBy, setFilterBy] = useState<string>(filters[0])

  const handleFilterChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setFilterBy(event.target.value)
  }

  useEffect(() => {
    if (isSuccess && data) {
      setShifts(
        data.ids?.filter(
          (id: EntityId) => data.entities[id]?.usersAssigned?.length === 0
        )
      )
    }
  }, [isSuccess, data])

  // runs when the component mounts and when filterBy or shifts changes
  // the filtered shifts (filtered by day)
  useEffect(() => {
    console.log('Changing filters')

    setDisplayShifts(
      filterBy === filters[0]
        ? shifts
        : shifts?.filter((shiftId) =>
            data?.entities[shiftId]?.possibleDays
              .map((day) => day.toLocaleLowerCase())
              .includes(filterBy)
          )
    )
  }, [filterBy, shifts, data])

  if (isLoading) {
    return <div>Loading...</div>
  } else if (isError) {
    return <div>Error</div>
  } else {
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
          data={displayShifts as EntityId[]}
          entities={
            data?.entities as Dictionary<
              Shift & { [key in keyof Shift]: string | number }
            >
          }
          headCells={headCells}
          isCheckable={false}
        />
      </>
    )
  }
}
