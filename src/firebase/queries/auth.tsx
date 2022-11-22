import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { addUser, getUser } from "./user";
import { useState, useEffect } from "react";
import { defaultUser } from "./user";
import { defaultHouse } from "./house";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../clientApp";
import { getHouse } from "./house";

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
	const [house, setHouse] = useState(defaultHouse)

	const authStateChanged = async (authState: any) => {
		if (!authState) {
			setAuthUser(defaultUser);
			return
		}
		establishUserContext(authState.uid)
	}

	useEffect(() => {
		const refresh = auth.onAuthStateChanged(authStateChanged);
		return () => refresh();
	}, [])

	const register = async (
			email: string,
			houseID: string,
			first_name: string,
			last_name: string,
			role: string,
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
					addUser(email, houseID, first_name, last_name, role, user.uid).then(() => {
						signIn(email, password)
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
					getHouse(userFromDoc.houseID).then((houseFromDoc) => {
						console.log("HOUSE FROM FIREBASE:", houseFromDoc)
						setHouse(houseFromDoc)
					})
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
		house, 
		register, 
		signIn, 
		signOutAuth,
		establishUserContext,
		deleteUser, 
	};
}