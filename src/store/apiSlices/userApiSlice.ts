import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { User } from '../../types/schema'
import { apiSlice } from '../api/apiSlice'
import { RootState } from '../store'
// import { formatMilitaryTime } from '../../utils/utils'

type result = { data: User; id: string }
type transformResponse = { data: result[] }

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `users`,
        method: 'GET',
        validateStatus: (response, result) => {
          // console.log('response: ', response, ' -- result: ', result)
          return response.status === 200 && !result.isError
        },
      }),
      //   keepUnusedDataFor: 60,
      transformResponse: (responseData: transformResponse) => {
        // console.log('[transformResponse] responseData: ', responseData)
        const loaddedUsers = responseData?.data.map((entity) => {
          entity.data.id = entity.id
          return entity.data
        })
        console.debug(loaddedUsers)
        return usersAdapter.setAll(initialState, loaddedUsers)
      },
      //   providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //       return [
      //         { type: 'User', id: 'LIST' },
      //         ...result.ids.map((id) => ({ type: 'User', id })),
      //       ]
      //     } else return [{ type: 'User', id: 'LIST' }]
      //   },
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: `users`,
        method: 'POST',
        body: {
          ...data.data,
        },
      }),
      //   invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `users/${data.userId}`,
        method: 'PATCH',
        body: {
          ...data.data,
        },
      }),
      //   invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    // deleteUser: builder.mutation({
    //   query: ({ id }) => ({
    //     url: '/users',
    //     method: 'DELETE',
    //     body: { id },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    // }),
  }),
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  //   useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({})

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entries
)

// getSelectors creates these selector and we rename them with aliases using destructing
// Andrei: Selectors just select something that's already queried.  Can be used for querying.  Can ONLY be used on cached information
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that return the user slice of a state
} = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState
)
