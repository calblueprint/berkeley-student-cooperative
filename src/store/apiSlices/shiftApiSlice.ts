import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { Shift } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'
import { formatMilitaryTime } from '../../utils/utils'

type result = { data: Shift; id: string }
type transformResponse = { data: result[] }

const shiftsAdapter = createEntityAdapter<Shift>({})

const initialState = shiftsAdapter.getInitialState()

export const shiftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: (houseId) => ({
        url: `houses/${houseId}/shifts`,
        method: 'GET',
        validateStatus: (response, result) => {
          // console.log('response: ', response, ' -- result: ', result)
          return response.status === 200 && !result.isError
        },
      }),
      //   keepUnusedDataFor: 60,
      transformResponse: (responseData: transformResponse) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedShifts = responseData?.data.map((entity) => {
          entity.data.id = entity.id
          if (!entity.data.timeWindowDisplay) {
            entity.data.timeWindowDisplay =
              formatMilitaryTime(entity.data.timeWindow[0]) +
              ' - ' +
              formatMilitaryTime(entity.data.timeWindow[1])
          }
          return entity.data
        })
        console.debug(loaddedShifts)
        return shiftsAdapter.setAll(initialState, loaddedShifts)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'Shift', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Shift' as const, id })),
          ]
        } else return [{ type: 'Shift', id: 'LIST' }]
      },
    }),
    addNewShift: builder.mutation({
      query: (data) => ({
        url: `houses/${data.houseId}/shifts`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'Shift', id: 'LIST' }],
    }),
    updateShift: builder.mutation({
      query: (data) => ({
        url: `houses/${data.houseId}/shifts/${data.shiftId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg.id }],
    }),
    // deleteShift: builder.mutation({
    //   query: ({ id }) => ({
    //     url: '/shifts',
    //     method: 'DELETE',
    //     body: { id },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg.id }],
    // }),
  }),
})

export const {
  useGetShiftsQuery,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
  //   useDeleteShiftMutation,
} = shiftsApiSlice

// returns the query result object
export const selectShiftsResult = shiftsApiSlice.endpoints.getShifts.select({})

// creates memoized selector
const selectShiftsData = createSelector(
  selectShiftsResult,
  (shiftsResult) => shiftsResult.data // normalized state object with ids & entries
)

// getSelectors creates these selector and we rename them with aliases using destructing
export const {
  selectAll: selectAllShifts,
  selectById: selectShiftById,
  selectIds: selectShiftIds,
  // Pass in a selector that return the shift slice of a state
} = shiftsAdapter.getSelectors(
  (state: RootState) => selectShiftsData(state) ?? initialState
)
