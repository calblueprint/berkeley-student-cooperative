import React, { useState } from "react";
import { createContext, useContext } from "react";
import { useFirebaseAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";
import { User } from "firebase/auth";
import { userAgent } from "next/server";

const authUserContext = createContext({
	authUser: defaultUser, setAuthUser: ()=>{},
//   authUser: defaultUser,
//   setAuthUser: (user: User) => {}
//   house: defaultHouse,
//   setAuthUser: () => {},
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
// 	deleteUser: async (uid: string) => {}
});

export const AuthUserProvider = ({children}: any) => {
	const {authUser, setAuthUser} = useContext(authUserContext)
	
	const [user, setUser] = useState(defaultUser);
	const auth = useFirebaseAuth();
	setUser(auth.authUser);

	const value = {authUser:user, setAuthUser:setUser};

	return (
		<authUserContext.Provider value = {value}> {children} </authUserContext.Provider>
	)
}

export const useUserContext = () => useContext(authUserContext);