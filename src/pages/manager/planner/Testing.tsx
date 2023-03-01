import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { RootState } from '../../../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../../store/slices/counterSlice'
import { useGetShiftsQuery } from '../../../store/apiSlices/shiftApiSlice'

const Testing = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const { data, isLoading } = useGetShiftsQuery('EUC')
  const dispatch = useDispatch()

  React.useEffect(() => {
    console.log('isLoading =', isLoading)
    console.log(data)
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

export default Testing
