import React, { useState } from 'react'
// import { createContext, useContext } from 'react'
// import { useFirebaseAuth } from '../firebase/queries/auth'
// import { defaultUser } from '../firebase/queries/user'
// import { defaultHouse } from '../firebase/queries/house'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/clientApp'
import { useRouter } from 'next/router'
import { useEstablishContextMutation } from '../store/apiSlices/authApiSlice'
import { useEffect } from 'react'
import { Box } from '@mui/material'

// export const authUserContext = createContext({
//   authUser: defaultUser, // added
//   // setAuthUser: function(user:any){},  // added
//   house: defaultHouse,
//   register: async (
//     email: string,
//     houseID: string,
//     lastName: string,
//     firstName: string,
//     role: string,
//     password: string
//   ) => {},
//   signIn: async (email: string, password: string) => {},
//   signOutAuth: () => {},
//   deleteUser: async (uid: string) => {},
// })

// export const AuthUserProvider = ({ children }: any) => {
//   const val = useFirebaseAuth()

//   return (
//     <authUserContext.Provider value={val}>
//       {' '}
//       {
//         /**
//          * When loading is true the authStateChanged() is fetching a user and
//          * false when is done. This allows the children componets to wait for the
//          * user to be fetch. If we proceed without waiting the children componets
//          * try to use a null user which gives an error.
//          * When lodign is true nothing is displayed, but if desired a loding component could
//          * be displayed intead of null.
//          */
//         val['loading'] ? <div>Loading User</div> : children
//       }{' '}
//     </authUserContext.Provider>
//   )
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthState = ({ children }: any) => {
  const router = useRouter()
  const [establishContext, { isLoading, isSuccess, isError, error }] =
    useEstablishContextMutation()
  const [authUser, setAuthUser] = useState({})

  useEffect(() => {
    console.log('*****AuthState Component ran')
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('[AuthState]: Authorized User: ' + user)
        setAuthUser(user)
        await establishContext(user.uid)

        // console.log('Error: ', error)
      } else {
        console.log('[]AuthState]: Not authorized')
        router.replace('/login')
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    console.log('[AuthState]: authUser: ', authUser)
  }, [authUser, isSuccess])

  if (isLoading) {
    return <Box> Loading...</Box>
  } else if (isError) {
    console.log(error)
    return <Box>There was an Error </Box>
  } else if (isSuccess) {
    return <React.Fragment>{authUser ? children : null}</React.Fragment>
  } else {
    return (
      <>
        <Box>{children}</Box>
        {/* <React.Fragment>{children}</React.Fragment> */}
      </>
    )
  }
}

// export const useUserContext = () => useContext(authUserContext)
