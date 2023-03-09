import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { RootState } from '../../../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../../store/slices/counterSlice'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { Shift } from '../../../types/schema'
import { HeadCell } from '../../../interfaces/interfaces'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
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

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const { data, isLoading } = useGetShiftsQuery('EUC')
  const dispatch = useDispatch()

  React.useEffect(() => {
    // console.log('isLoading =', isLoading)
    // console.log(data)
  }, [isLoading, data])

  if (isLoading) {
    return <h1>Is Loading...</h1>
  } else {
    return (
      <>
        <Box>
          <Button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </Button>
          <Typography color="black">{count}</Typography>
          <Button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </Button>
        </Box>
      </>
    )
  }
}

const ShiftTesting = () => {
  const {
    data: dataShifts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetShiftsQuery('EUC')

  const [openCard, setOpenCard] = React.useState<boolean>(false)
  const [selectedShiftId, setSelectedShiftId] = React.useState<
    string | undefined
  >()

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    console.log('ShiftId: ', id)
    setSelectedShiftId(id)
    setOpenCard(true)
  }

  React.useEffect(() => {
    if (isSuccess) {
      console.log('Shifts Entity: ', dataShifts)
    }
    if (isError) {
      console.log('Error: ', error)
    }
  }, [isSuccess, dataShifts, isError, error])

  React.useEffect(() => {
    if (selectedShiftId) {
      console.log('Selected Shift: ', selectedShiftId)
    }
  }, [selectedShiftId])

  let content = null
  if (isLoading) {
    content = <Box>is Loading...</Box>
  } else if (isError) {
    content = <React.Fragment>is Error...</React.Fragment>
  } else if (isSuccess) {
    content = (
      <React.Fragment>
        <NewShiftCardTest shiftId={selectedShiftId} />
        <SortedTable
          ids={dataShifts.ids as EntityId[]}
          entities={
            dataShifts?.entities as Dictionary<
              Shift & { [key in keyof Shift]: string | number }
            >
          }
          headCells={shiftHeadCells}
          isCheckable={false}
          isSortable={true}
          handleRowClick={handleClick}
        />
        <EditShiftCardTest
          shiftId={selectedShiftId}
          setOpen={setOpenCard}
          open={openCard}
        />
      </React.Fragment>
    )
  }
  return content
}

const ReduxTesting = () => {
  return (
    <React.Fragment>
      <Counter />

      <ShiftTesting />
    </React.Fragment>
  )
}

export default ReduxTesting
