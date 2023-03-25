import { createSelector, createEntityAdapter, EntityId } from '@reduxjs/toolkit'
import { Shift } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'

const authorizedUsersAdapter = createEntityAdapter<Shift>({})

const initialState = authorizedUsersAdapter.getInitialState()

export const authorizedUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthorizedUsers: builder.query({
      query: () => ({
        url: `authorizedUsers`,
        method: 'GET',
        data: { body: 'hello world' },
        params: { queryType: 'authorized users' },
        // validateStatus: (response, result) => {
        //   console.log('response: ', response, ' -- result: ', result)
        //   return response.status === 200 && !result.isError
        // },
      }),
      // keepUnusedDataFor: 60,
      transformResponse: (responseData: Shift[]) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loadedAuthorizedUsers = responseData.map((entity) => {
          // console.log('[loaddedShifts] entity: ', entity)
          entity.id = entity.id
          return entity
        })
        console.debug(loadedAuthorizedUsers)
        return authorizedUsersAdapter.setAll(
          initialState,
          loadedAuthorizedUsers
        )
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: 'AuthorizedUser', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'AuthorizedUser' as const,
              id,
            })),
          ]
        } else return [{ type: 'AuthorizedUser', id: 'LIST' }]
      },
    }),
    addNewAuthorizedUser: builder.mutation({
      query: (data) => ({
        url: `authorizedUsers`,
        method: 'POST',
        body: {
          ...data,
        },
      }),
      invalidatesTags: [{ type: 'AuthorizedUser', id: 'LIST' }],
    }),
    updateAuthorizedUser: builder.mutation({
      query: (data) => ({
        url: `authorizedUsers/${data.userId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'AuthorizedUser', id: arg.id },
      ],
    }),
    //TODO DELETEAUTHORIZEDUSERS
  }),
})

export const {
  useGetAuthorizedUsersQuery,
  useAddNewAuthorizedUserMutation,
  useUpdateAuthorizedUserMutation,
  //   useDeleteShiftMutation,
} = authorizedUsersApiSlice

// Creates memoized selector to get normalized state based on the query parameter
const selectAuthorizedUsersData = createSelector(
  (state: RootState, queryParameter: string) =>
    authorizedUsersApiSlice.endpoints.getAuthorizedUsers.select(queryParameter)(
      state
    ),
  (shiftsResult) => shiftsResult.data ?? initialState
)

// Creates memoized selector to get a shift by its ID based on the query parameter
export const selectAuthorizedUsersById = (queryParameter: string) =>
  createSelector(
    (state: RootState) => selectAuthorizedUsersData(state, queryParameter),
    (_: unknown, authorizedUserId: EntityId) => authorizedUserId,
    (
      data: { entities: { [x: string]: unknown } },
      authorizedUserId: string | number
    ) => data.entities[authorizedUserId]
  )
