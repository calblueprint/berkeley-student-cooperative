import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentHouse: null,
    currentUser: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, house } = action.payload
      state.currentUser = user
      state.currentHouse = house
    },

    setCurrentHouse: (state, action) => {
      state.currentHouse = action.payload
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    logOut: (state) => {
      state.currentUser = null
      state.currentHouse = null
    },
  },
})

export const { setCredentials, logOut, setCurrentHouse, setCurrentUser } =
  authSlice.actions
export const selectCurrentHouse = (state: RootState) => state.auth.currentHouse
export const selectCurrentUser = (state: RootState) => state.auth.currentUser

export default authSlice.reducer
