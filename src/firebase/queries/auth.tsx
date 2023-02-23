import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { addUser, getUser } from './user'
import { useState, useEffect } from 'react'
import { defaultUser } from './user'
import { defaultHouse } from './house'
import { doc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../clientApp'
import { getHouse } from './house'

//managers don't have to register.  House will be matched to email
//userID is going to get generated in register.
/*
    1. Have them register
    2. Check the email used in register, match it to an email in a csv
    3. Retrieve the House from this CSV
    4. If this works, continue and generate a userID
    5. Pass all of this info to addUser.
*/

export const useFirebaseAuth = () => {
  /**
   * Returns all functions that are related to auth:
   * 	authUser, register, loading, register, signIn,
   * 	signOutAuth, establishUserContext, deleteUser
   *
   * Accessed by other files by calling:
   * const { authUser, signIn, ... } = useFirebaseAuth()
   *
   * No params
   *
   * @returns multiple functions related to auth
   */

  // retreives firebase auth
  const auth = getAuth()

  // state var for authUser (current signed in user)
  const [authUser, setAuthUser] = useState(defaultUser)

  // state var for house of current signed in user
  const [house, setHouse] = useState(defaultHouse)

  /**
   *  @brif This variabel signals the authUserContext.Provider if authStateChange() function is
   * 		running and fetching a user from the server.
   *
   *  @param loading: true when authStateChanged is running  and false otherwise
   *
   *  @param setLoading sets the state of Loading
   */
  const [loading, setLoading] = useState(true)

  // useEffect that calls authStateChanged() everytime the auth state is changed (refresh, signIn, navigating pages)
  useEffect(() => {
    const refresh = auth.onAuthStateChanged(authStateChanged)
    return () => refresh()
  }, [])

  const register = async (
    email: string,
    houseID: string,
    lastName: string,
    firstName: string,
    role: string,
    password: string
  ): Promise<void> => {
    /**
     * Registers a new user and adds their user object to firebase collection
     *
     * @param email - email of user
     * @param houseID - ID of user's assigned house
     * @param lastName - last name of user
     * @param firstName - first name of user
     * @param role - role of user
     * @param password - password that user has typed in
     *
     * @returns void
     */
    try {
      //PENDING: Search for email in CSV once this func is available.

      // calling firebase function to create a new user with email and password
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user
          console.log('Created User:', user)
          // adding user with given parameters to firebase Users collection
          addUser(email, houseID, lastName, firstName, role, user.uid).then(
            () => {
              establishUserContext(user.uid)
            }
          )
        }
      )
    } catch (e) {
      console.log('ERROR')
      console.error(e)
      throw e
    }
  }

  const signIn = async (email: string, password: string) => {
    /**
     * Signs in the user given an email and password for logging in
     * Calls establishUserContext to set authUser once the user is signed in
     *
     * @param email - email of user
     * @param password - password that user has typed in
     *
     * @returns void
     */
    try {
      console.log('Email: ', email, ' Password: ', password)

      // firebase signIn function with email and passoword
      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const userID = userCredential.user.uid
          establishUserContext(userID)
        }
      )
    } catch (e) {
      console.log('Error Logging In')
      console.error(e)
      throw e
    }
  }

  const establishUserContext = async (uid: string): Promise<void> => {
    /**
     * Sets authUser to the user with the given uid
     * Sets house to the house object taken from the users houseID parameter
     *
     * @param uid - uid of the user to be signedIn
     *
     * @returns void
     */
    try {
      getUser(uid).then((userFromDoc) => {
        if (userFromDoc != null) {
          console.log('USER FROM FIREBASE: ', userFromDoc)
          setAuthUser(userFromDoc)
          getHouse(userFromDoc.houseID).then((houseFromDoc) => {
            console.log('HOUSE FROM FIREBASE:', houseFromDoc)
            setHouse(houseFromDoc)

            /** Once setAuthUser and setHouse completed, we can signal the authUserContext.Provider to proceed */
            setLoading(false)
          })
        } else {
          console.log('user does not exist')

          /** Signal authUserContext.Provider to proceed  */
          setLoading(false)
        }
      })
    } catch (e) {}
  }

  const signOutAuth = async (): Promise<void> => {
    /**
     * Calls firebase signOut and sets authUser and house to default empty objects
     *
     * No params
     *
     * @returns void
     */
    try {
      await signOut(auth)
      setAuthUser(defaultUser)
      setHouse(defaultHouse)
      console.log('Signed Out!!')
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  // function that is called in useEffect every time the auth state is changed (refresh, signin, signout, etc)
  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setAuthUser(defaultUser)

      /* If authState is false then no user fetching is needed. Signal authUserContext.Provider to proceed  */
      setLoading(false)
      return
    }

    // call user context to update authUser and house to the current authState
    await establishUserContext(authState.uid)
  }

  const deleteUser = async (uid: string): Promise<void> => {
    /**
     * Deletes the user from firebase
     *
     * @param uid - uid of user to be deleted
     *
     * @returns void
     */
    await deleteDoc(doc(firestore, 'users', uid))
  }

  return {
    authUser,
    house,
    loading,
    register,
    signIn,
    signOutAuth,
    establishUserContext,
    deleteUser,
  }
}
