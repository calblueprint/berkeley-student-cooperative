import { apiSlice } from '../api/apiSlice'
import { firestore, auth } from '../../firebase/clientApp'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { User, House } from '../../types/schema'
import { setCredentials, logOut } from '../slices/authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
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
          return await establishUserContext(userCredentials.user.uid)
          // const userID = userCredentials.user.uid
          // const docRef = doc(firestore, 'users', userID)
          // const docSnap = await getDoc(docRef)
          // if (!docSnap.exists()) {
          //   return { error: 'No user with those credentials in the database' }
          // }
          // const user = docSnap.data() as User
          // user.id = docSnap.id.toString()
          // if (!user.id) {
          //   return { error: 'User does not have attribute --id-' }
          // }
          // const houseDocRef = doc(firestore, 'houses', user.houseID)
          // const houseSnap = await getDoc(houseDocRef)

          // if (!houseSnap.exists()) {
          //   return { error: 'User not assigned to a valid house.' }
          // }
          // const house = houseSnap.data() as House
          // return { data: { user, house } }
        } catch (error) {
          console.log('Error Logging In')
          console.error(error)
          return { error }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          console.log('Query Fulfilled: ', result)
          if (!result.data) {
            console.log('User and House object are empty')
            return
          }
          const { user, house } = result.data
          dispatch(setCredentials({ user, house }))
          // return { data: arg }
        } catch (error) {
          console.log(error)
        }
      },
    }),

    authLogOut: builder.mutation({
      async queryFn() {
        try {
          const result = await signOut(auth)
          console.log('logout result: ' + result)
          return { data: 'Logged Out' }
        } catch (error) {
          return { error }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logOut())
          dispatch(apiSlice.util.resetApiState())
        } catch (error) {
          console.log(error)
        }
      },
    }),

    establishContext: builder.mutation({
      async queryFn(userId: string) {
        return await establishUserContext(userId)
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          // console.log('[Refreshed]: Query Fulfilled: ', result)
          if (!result.data) {
            console.log('User and House object are empty')
            return
          }
          const { user, house } = result.data
          // console.log(
          //   '[Refreshed]: Query Fulfilled:  --user: ',
          //   user,
          //   '  --house: ',
          //   house
          // )
          dispatch(setCredentials({ user, house }))
          // return { data: arg }
        } catch (error) {
          console.log(error)
        }
      },
    }),
  }),
})

const establishUserContext = async (userId: string) => {
  try {
    if (!userId) {
      return { error: 'Wrong credentials' }
    }
    console.log('Establishing Context with: ', userId)
    const userID = userId
    const docRef = doc(firestore, 'users', userID)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { error: 'No user with those credentials in the database' }
    }
    const user = docSnap.data() as User
    user.id = docSnap.id.toString()
    if (!user.id) {
      return { error: 'User does not have attribute --id-' }
    }
    const houseDocRef = doc(firestore, 'houses', user.houseID)
    const houseSnap = await getDoc(houseDocRef)

    if (!houseSnap.exists()) {
      return { error: 'User not assigned to a valid house.' }
    }
    const house = houseSnap.data() as House

    return { data: { user, house } }
  } catch (error) {
    return { error }
  }
}

export const {
  useLoginMutation,
  useAuthLogOutMutation,
  useEstablishContextMutation,
} = authApiSlice
