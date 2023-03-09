import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { Shift } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'
import { formatMilitaryTime } from '../../utils/utils'

const shiftsAdapter = createEntityAdapter<Shift>({})

const initialState = shiftsAdapter.getInitialState()

export const shiftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: (houseId) => ({
        url: `houses/${houseId}/shifts`,
        method: 'GET',
        data: { body: 'hello world' },
        params: { queryType: 'shifts' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: Shift[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedShifts = responseData.map((entity) => {
          // console.log('[loaddedShifts] entity: ', entity)
          entity.id = entity.id
          if (!entity.timeWindowDisplay) {
            entity.timeWindowDisplay =
              formatMilitaryTime(entity.timeWindow[0]) +
              ' - ' +
              formatMilitaryTime(entity.timeWindow[1])
          }
          return entity
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

// Creates memoized selector to get normalized state based on the query parameter
const selectShiftsData = createSelector(
  (state: RootState, queryParameter: string) =>
    shiftsApiSlice.endpoints.getShifts.select(queryParameter)(state),
  (shiftsResult) => shiftsResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectShiftById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectShiftsData(state, queryParameter),
    (_: unknown, shiftId: EntityId) => shiftId,
    (data: { entities: { [x: string]: unknown } }, shiftId: string | number) =>
      data.entities[shiftId]
  )
