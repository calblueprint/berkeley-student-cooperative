<<<<<<< HEAD
import { createContext, useContext, useEffect } from "react";
=======
import React from "react";
import { createContext, useContext } from "react";
>>>>>>> 9e399b7883cafdebecea432e1831969c85f73d83
import { useFirebaseAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";
import { browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";



export const authUserContext = createContext({
  authUser: defaultUser, // added
  // setAuthUser: function(user:any){},  // added
  house: defaultHouse,
  register: async (
    email: string,
    houseID: string,
    lastName: string,
    firstName: string,
    role: string,
    password: string
  ) => {},
  signIn: async (email: string, password: string) => {},
  signOutAuth: () => {},
	deleteUser: async (uid: string) => {}
});

export const AuthUserProvider = ({children}: any) => {
 
  const val = useFirebaseAuth();

	return (
		<authUserContext.Provider value={val}> {
      /** 
       * When loading is true the authStateChanged() is fetching a user and 
       * false when is done. This allows the children componets to wait for the 
       * user to be fetch. If we proceed without waiting the children componets 
       * try to use a null user which gives an error. 
       * When lodign is true nothing is displayed, but if desired a loding component could 
       * be displayed intead of null.
       */
      val["loading"]? 
      <div>Loading User</div> :
      children
      } </authUserContext.Provider>
	)
}

export const useUserContext = () => useContext(authUserContext);