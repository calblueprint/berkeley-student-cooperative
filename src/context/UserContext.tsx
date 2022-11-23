import { createContext, useContext } from "react";
import { useFirebaseAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";

const authUserContext = createContext({
	authUser: defaultUser,
	house: defaultHouse,
  signIn: async (email: string, password: string) => {},
  register: async (email: string, houseID:string, first_name: string, last_name: string, role: string, password: string) => {},
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