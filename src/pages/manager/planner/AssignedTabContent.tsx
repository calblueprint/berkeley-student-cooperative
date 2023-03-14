import React from 'react'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
import { HeadCell } from '../../../interfaces/interfaces'
import { Shift } from '../../../types/schema'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { ShiftAssignmentCard } from '../../../components/ManagerComponents/shiftAssignmentCard/ShiftAssignmentCard'

const shiftHeadCells: HeadCell<
  Shift & { [key in keyof Shift]: string | number }
>[] = [
  {
    id: 'name',
    isNumeric: false,
    label: 'Shift Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'timeWindowDisplay',
    isNumeric: true,
    label: 'Time',
    isSortable: false,
    align: 'left',
  },
  {
    id: 'hours',
    isNumeric: true,
    label: 'Value',
    isSortable: true,
    align: 'left',
  },
]

const filters = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const AssignedTabContent = () => {
  const { house } = useUserContext()
  const { data, isLoading, isSuccess, isError } = useGetShiftsQuery(
    house?.houseID
  )

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [selectedShiftId, setSelectedShiftId] = useState<EntityId>()
  //** end Modal stuff */

  //** Table stuff */
  const [shifts, setShifts] = useState<EntityId[] | undefined>([])
  const [displayShifts, setDisplayShifts] = useState<EntityId[] | undefined>(
    shifts
  )
  const [filterBy, setFilterBy] = useState<string>(filters[0])
  //** end Table stuff */

  //** this function handles passing the info from selected item from table to the modal that pops open */
  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    shiftId: EntityId
  ) => {
    // console.log('event: ', event, 'shift: ', shiftId)
    setSelectedShiftId(shiftId)
    handleOpen()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setFilterBy(event.target.value)
  }

  useEffect(() => {
    if (isSuccess && data) {
      setShifts(
        data.ids?.filter(
          (id: EntityId) =>
            data.entities[id]?.assignedUser != undefined &&
            data.entities[id]?.assignedUser != ''
        )
      )
    }
  }, [isSuccess, data])

  // runs when the component mounts and when filterBy or shifts changes
  // the filtered shifts (filtered by day)
  useEffect(() => {
    // console.log('Changing filters')
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
        <Select value={filterBy} onChange={handleFilterChange}>
          {filters.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
        <SortedTable
          ids={displayShifts as EntityId[]}
          entities={
            data?.entities as Dictionary<
              Shift & { [key in keyof Shift]: string | number }
            >
          }
          headCells={shiftHeadCells}
          isCheckable={false}
          isSortable={true}
          handleRowClick={handleRowClick}
        />
        <ShiftAssignmentCard
          shiftId={selectedShiftId}
          selectedDay={filterBy}
          handleClose={handleClose}
          open={open}
        />
      </>
    )
  }
}
