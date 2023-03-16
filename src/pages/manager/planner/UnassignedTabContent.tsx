import React from 'react'
import { Box, Stack, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { HeadCell } from '../../../interfaces/interfaces'
import { Shift, User } from '../../../types/schema'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import { ShiftAssignmentCard } from '../../../components/ManagerComponents/shiftAssignmentCard/ShiftAssignmentCard'
import NewShiftCardTest from '../../../components/ManagerComponents/Shiftcard/NewShiftCardTest'
import EditShiftCardTest from '../../../components/ManagerComponents/Shiftcard/EditShiftCardTest'

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

const UnassignedTabContent = () => {
  const authUser = useSelector(selectCurrentUser) as User
  const { data, isLoading, isSuccess, isError, error } = useGetShiftsQuery(
    authUser.houseID
  )

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [selectedShiftId, setSelectedShiftId] = useState<EntityId>()
  //** end Modal stuff */

  const [openEditShift, setOpenEditShift] = useState<boolean>(false)
  const [editShiftId, setEditShiftId] = useState<string>('')

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

  const handleEditShift = (shiftId: string) => {
    setEditShiftId(shiftId)
    setOpenEditShift(true)
    handleClose()
  }

  useEffect(() => {
    if (isSuccess && data) {
      setShifts(
        data.ids?.filter(
          (id: EntityId) =>
            data.entities[id]?.assignedUser === undefined ||
            data.entities[id]?.assignedUser?.length === 0
        )
      )
    }
  }, [isSuccess, data])

  // runs when the component mounts and when filterBy or shifts changes
  // the filtered shifts (filtered by day)
  useEffect(() => {
    // console.log('Changing filters', data?.entities)
    const newShifts = shifts?.filter((shiftId) =>
      data?.entities[shiftId]?.possibleDays
        .map((day) => {
          // console.log('--day:  ', day.toLocaleLowerCase())
          return day.toLocaleLowerCase()
        })
        .includes(filterBy)
    )

    // console.log(newShifts)
    setDisplayShifts(newShifts)
  }, [filterBy, shifts, data])

  useEffect(() => {
    console.log(authUser)
  }, [authUser])

  if (isLoading) {
    return <div>Loading...</div>
  } else if (isError) {
    console.log(error)
    return <div>Error</div>
  } else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Stack>
          <Grid container>
            <Grid xs />
            <Grid
              smOffset={'auto'}
              mdOffset={'auto'}
              lgOffset={'auto'}
              bgcolor={'#fff'}
            >
              <FormControl size="small">
                {/* <InputLabel id="day-select-small">Day</InputLabel> */}
                <Select value={filterBy} onChange={handleFilterChange}>
                  {filters.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
              <NewShiftCardTest />
            </Grid>
          </Grid>
        </Stack>
        <Stack>
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
            handleEditShift={handleEditShift}
            open={open}
          />
          <EditShiftCardTest
            shiftId={editShiftId}
            setOpen={setOpenEditShift}
            open={openEditShift}
          />
        </Stack>
      </Box>
    )
  }
}

export default UnassignedTabContent
