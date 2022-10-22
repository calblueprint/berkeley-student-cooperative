import { getAuth, createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import { addUser, getUser } from "./userQueries";
import React, { createContext, useContext, useState } from "react";
import { User} from "../../types/schema";
import { defaultUser } from "./user";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../clientApp";

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
	const auth = getAuth();
	const [authUser, setAuthUser] = useState(defaultUser);

	const register = async (
			email: string,
			name: string,
			password: string
	): Promise<void> => {
			try {
					//PENDING: Search for email in CSV once this func is available.
					createUserWithEmailAndPassword(auth, email, password )
					.then((userCredential) => {
						const user = userCredential.user;
						console.log("Created User:", user);
						/* 
							Signed in
							PENDING Completion of addUser
							PENDING Role is automatically resident/ not Manager
							PENDING HouseID found in csv
							addUser(email, houseID, name, role, user.uid)
						*/
					addUser(email, "Euclid", name, "Member", user.uid).then(() => {
						establishUserContext(user.uid);
					});
					})
			} catch(e) {
				console.error(e);
				throw e
			}
	};

	const signIn = async (
		email: string,
		password: string
	) => {
		try {
			console.log("Email: ", email, " Password: ", password);
			signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const userID= userCredential.user.uid;
				establishUserContext(userID);
			})
		} catch(e) {
			console.error(e);
			throw e;
		}
	};

const signOutAuth = async (): Promise<void> => {
		try {
			await signOut(auth);
			setAuthUser(defaultUser);
			console.log("Signed Out!!");
		} catch (e) {
			console.error(e);
			throw e;
		}
	};

	
	const establishUserContext = async(uid: string): Promise<void> => {
		try {
			getUser(uid).then((userFromDoc) => {
				if (userFromDoc != null) {
					console.log("USER FROM FIREBASE: ", userFromDoc);
					setAuthUser(userFromDoc);
				} else {
					console.log("user does not exist");
				}
			})
		} catch (e) {
		}
	}

	const deleteUser = async(uid: string): Promise<void> => {
		await deleteDoc(doc(firestore, "users", uid ));
	}
	
	return {
		authUser, 
		register, 
		signIn, 
		signOutAuth,
		establishUserContext,
		deleteUser, 
	};
}

const authUserContext = createContext({
	authUser: defaultUser,
  signIn: async (email: string, password: string) => {},
  register: async (email: string, name: string, password: string) => {},
  signOutAuth: () => {},
	establishUserContext: async (uid: string) => {},
	deleteUser: async (uid: string) => {}
});

export const AuthUserProvider = ({children}: any) => {
	const auth = useFirebaseAuth();
	return (
		<authUserContext.Provider value = {auth}> {children} </authUserContext.Provider>
	)
}

export const useAuth = () => useContext(authUserContext);