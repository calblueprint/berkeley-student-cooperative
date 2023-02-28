import React from 'react'
import type { RootState } from '../../../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../../store/slices/counterSlice'
import { useGetHousesQuery } from '../../../store/api/apiSlice'

const Testing = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const { data, isLoading } = useGetHousesQuery('houses/EUC/shifts')
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
        <div>
          <div>
            <button
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <span>{count}</span>
            <button
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default Testing
