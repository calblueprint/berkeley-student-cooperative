import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { ScheduledShift } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'

const scheduledShiftsAdapter = createEntityAdapter<ScheduledShift>({})

const initialState = scheduledShiftsAdapter.getInitialState()

export const scheduledShiftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScheduledShifts: builder.query({
      query: (houseId) => ({
        url: `houses/${houseId}/scheduledShifts`,
        method: 'GET',
        data: { body: 'hello world' },
        params: { queryType: 'scheduledshifts' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: ScheduledShift[]) => {
        const loaddedShifts = responseData.map((entity) => {
          entity.id = entity.id
          return entity
        })
        console.debug(loaddedShifts)
        return scheduledShiftsAdapter.setAll(initialState, loaddedShifts)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'ScheduledShift', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'ScheduledShift' as const,
              id,
            })),
          ]
        } else return [{ type: 'ScheduledShift', id: 'LIST' }]
      },
    }),
    addNewScheduledShift: builder.mutation({
      query: (data) => ({
        url: `houses/${data.houseId}/scheduledShifts`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'ScheduledShift', id: 'LIST' }],
    }),
    updateScheduledShift: builder.mutation({
      query: (data) => ({
        url: `houses/${data.houseId}/scheduledShifts/${data.shiftId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ScheduledShift', id: arg.id },
      ],
    }),
    // deleteScheduledShifts: builder.mutation({
    //   query: (data) => ({
    //     url: `houses/${data.houseId}/scheduledShifts/${data.shiftId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'Shift', id: arg.id }],
    // }),
  }),
})

export const {
  useGetScheduledShiftsQuery,
  useAddNewScheduledShiftMutation,
  useUpdateScheduledShiftMutation,
  // useDeleteScheduledShiftsMutation,
} = scheduledShiftsApiSlice

// Creates memoized selector to get normalized state based on the query parameter
const selectScheduledShiftsData = createSelector(
  (state: RootState, queryParameter: string) =>
    scheduledShiftsApiSlice.endpoints.getScheduledShifts.select(queryParameter)(
      state
    ),
  (scheduledShiftsResult) => scheduledShiftsResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectScheduledShiftById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectScheduledShiftsData(state, queryParameter),
    (_: unknown, scheduledShiftId: EntityId) => scheduledShiftId,
    (
      data: { entities: { [x: string]: unknown } },
      scheduledShiftId: string | number
    ) => data.entities[scheduledShiftId]
  )
