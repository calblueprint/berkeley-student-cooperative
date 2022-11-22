import { createContext, useContext, useEffect } from "react";
import { useFirebaseAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";
import { browserLocalPersistence, browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";

const authUserContext = createContext({
	authUser: defaultUser,
	house: defaultHouse,
  signIn: async (email: string, password: string) => {},
  register: async (email: string, first_name: string, last_name: string, password: string) => {},
  signOutAuth: () => {},
	deleteUser: async (uid: string) => {}
});

export const AuthUserProvider = ({children}: any) => {
	const auth = useFirebaseAuth();
	return (
		<authUserContext.Provider value = {auth}> {children} </authUserContext.Provider>
	)
}

export const useUserContext = () => useContext(authUserContext);