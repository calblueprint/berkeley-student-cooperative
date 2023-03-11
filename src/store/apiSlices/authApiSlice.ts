import { apiSlice } from '../api/apiSlice'
import { firestore, auth } from '../../firebase/clientApp'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'
import { User } from '../../types/schema'
import { setCredentials } from '../slices/authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      //   query: (credentials) => ({
      //     url: '/auth',
      //     method: 'POST',
      //     body: { ...credentials },
      //   }),
      async queryFn({ email, password }) {
        try {
          console.log('Email: ', email, ' Password: ', password)

          // firebase signIn function with email and passoword
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          )
          console.log(userCredentials)

          if (!userCredentials) {
            return { error: 'Wrong credentials' }
          }
          const userID = userCredentials.user.uid
          const docRef = doc(firestore, 'users', userID)
          const docSnap = await getDoc(docRef)
          if (!docSnap.exists()) {
            return { error: 'No user with those credentials in the database' }
          }
          const user = docSnap.data()
          user.id = docSnap.id.toString()
          if (!user.id) {
            return { error: 'User does not have attribute --id-' }
          }
          const houseDocRef = doc(firestore, 'houses', user.houseID)
          const houseSnap = await getDoc(houseDocRef)

          if (!houseSnap.exists()) {
            return { error: 'User not assigned to a valid house.' }
          }
          const house = houseSnap.data()
          return { data: { user, house } }
        } catch (e) {
          console.log('Error Logging In')
          console.error(e)
          throw e
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          console.log('Query Fulfilled: ', result)
          if (!result.data) {
            return { error: 'No user and house found' }
          }
          const { user, house } = result.data
          dispatch(setCredentials({ user, house }))
          return { data: arg }
        } catch (error) {
          console.log(error)
        }
      },
    }),
    // sendLogout: builder.mutation({
    //   query: () => ({
    //     url: '/auth/logout',
    //     method: 'POST',
    //   }),
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       await queryFulfilled
    //       dispatch(logOut())
    //       dispatch(apiSlice.util.resetApiState())
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   },
    // }),
  }),
})

export const { useLoginMutation } = authApiSlice
