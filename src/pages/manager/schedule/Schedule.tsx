import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
// import UnassignedShiftList from '../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
// import { getAllShifts } from '../../../firebase/queries/shift'
import { HeadCell, Shift, User } from '../../../interfaces/interfaces'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'
import { useGetUsersQuery } from '../../../store/apiSlices/userApiSlice'
import { EntityId, Dictionary } from '@reduxjs/toolkit'

const shiftHeadCells: HeadCell<
  Shift & { [key in keyof Shift]: string | number }
>[] = [
  {
    id: 'name', //How it maps which info to go under each column.
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
  {
    id: 'status',
    isNumeric: false,
    label: 'Status',
    isSortable: true,
    align: 'left',
  },
]

const userHeadCells: HeadCell<
  Shift & { [key in keyof Shift]: string | number }
>[] = [
  {
    id: 'email',
    isNumeric: false,
    label: 'Email',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'hoursRequired',
    isNumeric: true,
    label: 'Hours Required',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'hoursAssigned',
    isNumeric: true,
    label: 'Value',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'Status',
    isNumeric: true,
    label: 'status',
    isSortable: true,
    align: 'left',
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

type scheduleProps = {
  individualFiltered: boolean
  isManager: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Schedule = ({ individualFiltered, isManager }: scheduleProps) => {
  const [targetName, setTargetName] = useState('')
  const [targetId, setTargetId] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { house, authUser } = useUserContext()
  const { data, isLoading, isSuccess, isError } = useGetShiftsQuery(
    house?.houseID
  )

  const {
    data: users,
    // isLoading: isUsersLoading,
    // isSuccess: isUsersSuccess,
    // isError: isUsersError,
  } = useGetUsersQuery({})

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [modalShift, setModalShift] = useState<Shift>()
  const [modalUser, setModalUser] = useState<User>()
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
    const shift = data?.entities[shiftId]
    setModalShift(shift)
    if (shift && shift.usersAssigned && shift.usersAssigned[0]) {
      setModalUser(users?.entities[shift.usersAssigned[0]])
    }
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

  const findTargetId = () => {
    if (!isManager) {
      setTargetId(authUser.userID)
    } else {
      users?.ids?.map((id: EntityId) => {
        let fullName =
          users.entities[id]?.firstName + ' ' + users?.entities[id]?.lastName
        fullName = fullName.toLocaleLowerCase()
        console.log({ fullName: fullName })
        if (fullName === targetName.toLocaleLowerCase()) {
          console.log({ targetName: targetName, targetId: targetId })
          setTargetId(id + '')
        }
      })
    }
  }

  useEffect(() => {
    if (isSuccess && data) {
      setShifts(data.ids)
      if (individualFiltered) {
        setShifts(
          data.ids?.filter((id: EntityId) =>
            data.entities[id]?.usersAssigned.includes(targetId)
          )
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, targetId])

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
        {/* <UnassignedShiftList /> */}
        <Select value={filterBy} onChange={handleFilterChange}>
          {filters.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
        {isManager && !individualFiltered ? (
          <Button variant="contained">Quick Shift (WIP) </Button>
        ) : (
          <div></div>
        )}
        {isManager && individualFiltered ? (
          <div>
            <TextField
              id="search-bar"
              className="text"
              value={targetName}
              onChange={(e) => {
                setTargetName(e.target.value)
              }}
              label="search"
              variant="outlined"
              placeholder="Search..."
              size="small"
            />
            <Button variant="contained" onClick={findTargetId}>
              search
            </Button>
            {/* <IconButton type="submit" aria-label="search">
             <SearchIcon style={{ fill: 'blue' }} />
           </IconButton> */}
          </div>
        ) : (
          <div></div>
        )}
        <SortedTable
          ids={displayShifts as EntityId[]}
          entities={
            data?.entities as Dictionary<
              Shift & { [key in keyof Shift]: string | number } //Typescript requirement.  The keys are keys of shift, the objects are Shift.
            >
          }
          headCells={shiftHeadCells}
          isCheckable={false}
          isSortable={true}
          handleRowClick={handleRowClick}
        />
        {/* Everything below is just to test the redux user api */}
        {/* When creating the actual card, it should be in it's own file that will get connecte here. */}
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleClose}
          className="dialog"
        >
          <DialogTitle variant="h4" component="h2">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={12}>{modalShift?.name}</Grid>
                <Grid xs={4}>
                  <Item>{`${modalShift?.hours} Hours`}</Item>
                </Grid>
                <Grid xs={4}>
                  <Item>
                    {modalShift?.possibleDays.reduce(
                      (previosValue, currentValue) => {
                        if (previosValue === '') {
                          return currentValue
                        } else {
                          return previosValue + ' , ' + currentValue
                        }
                      },
                      ''
                    )}
                  </Item>
                </Grid>
                <Grid xs={4}>
                  <Item>{modalShift?.timeWindowDisplay}</Item>
                </Grid>
                <Grid textAlign="left" xs={12}>
                  <Item sx={{ textAlign: 'left', fontSize: 'large' }}>
                    {modalUser ? modalUser.firstName : `No user assigned`}
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Paper>
              <SortedTable
                ids={users?.ids as EntityId[]}
                entities={
                  users?.entities as Dictionary<
                    Shift & { [key in keyof Shift]: string | number }
                  >
                }
                headCells={userHeadCells}
                isCheckable={false}
                isSortable={false}
                handleRowClick={handleRowClick}
              />
            </Paper>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}
