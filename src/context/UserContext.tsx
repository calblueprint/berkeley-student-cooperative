import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useFirebaseAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { defaultHouse } from "../firebase/queries/house";
import { User } from "firebase/auth";
import { userAgent } from "next/server";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
  
  // var x = {
  //   authUser: val["authUser"],//val["authUser"], // added
  //   // setAuthUser: (user:any) => {setUser(user)},  // added
  //   house: val["house"],
  //   register: val["register"],
  //   signIn: val["signIn"],
  //   signOutAuth: val["signOutAuth"],
  //   deleteUser: val["deleteUser"]
  // };
	// // setUser(auth.authUser);
  // console.log("********This is the context User: ")
  // console.log(x["authUser"])
  // console.log(val["authUser"])

	// const value = {authUser:user, setAuthUser:setUser};

	return (
		<authUserContext.Provider value={val}> {
      val["loding"]? 
      null : 
      children
      } </authUserContext.Provider>
	)
}

export const useUserContext = () => useContext(authUserContext);