import { createContext, useContext, useEffect } from "react";
import { useFirebaseAuth } from "../firebase/queries/auth";
import { User, House } from "../types/schema";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";
import { browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";

const authUserContext = createContext({
  authUser: defaultUser,
  house: defaultHouse,
  register: async (
    email: string,
    houseID: string,
    last_name: string,
    first_name: string,
    role: string,
    password: string
  ) => {},
  signIn: async (email: string, password: string) => {},
  signOutAuth: () => {},
	deleteUser: async (uid: string) => {}
});

export const AuthUserProvider = ({children}: any) => {
	const auth = useFirebaseAuth();
	console.log("calling useFirebaseAuth")
	return (
		<authUserContext.Provider value = {auth}> {children} </authUserContext.Provider>
	)
}

export const useUserContext = () => useContext(authUserContext);
