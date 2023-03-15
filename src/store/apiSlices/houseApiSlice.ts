import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { House } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'
// import { formatMilitaryTime } from '../../utils/utils'

const housesAdapter = createEntityAdapter<House>({})

const initialState = housesAdapter.getInitialState()

export const housesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHouse: builder.query({
      query: (houseId) => ({
        url: `houses/${houseId}`,
        method: 'GET',
        data: { body: 'hello world' },
        params: { queryType: 'houses' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: House[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loadedHouses = responseData.map((entity) => {
          // console.log('[loaddedShifts] entity: ', entity)
          entity.id = entity.id
          return entity
        })
        console.debug(loadedHouses)
        return housesAdapter.setAll(initialState, loadedHouses)
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'House', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'House' as const, id })),
          ]
        } else return [{ type: 'House', id: 'LIST' }]
      },
    }),
    addNewHouse: builder.mutation({
      query: (data) => ({
        url: `houses`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: [{ type: 'House', id: 'LIST' }],
    }),
    updateHouses: builder.mutation({
      query: (data) => ({
        url: `houses/${data.houseId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'House', id: arg.id }],
    }),
  }),
})

export const {
  useGetHouseQuery,
  useAddNewHouseMutation,
  useUpdateHousesMutation,
  //   useDeleteShiftMutation,
} = housesApiSlice

// Creates memoized selector to get normalized state based on the query parameter
const selectHouseData = createSelector(
  (state: RootState, queryParameter: string) =>
    housesApiSlice.endpoints.getHouse.select(queryParameter)(state),
  (shiftsResult) => shiftsResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectHouseById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectHouseData(state, queryParameter),
    (_: unknown, houseId: EntityId) => houseId,
    (data: { entities: { [x: string]: unknown } }, houseId: string | number) =>
      data.entities[houseId]
  )
