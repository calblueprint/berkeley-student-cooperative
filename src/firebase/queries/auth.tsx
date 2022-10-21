import { getAuth, createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import { addUser, getUser } from "./userQueries";
import React, { createContext, useContext, useState } from "react";
import { User} from "../../types/schema";
import { defaultUser } from "./user";

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
	const [user, setUser] = useState(defaultUser);

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
						getUser(user.uid).then((userFromDoc) => {
							//do we need this if we alreadt establish context ^^
							if (userFromDoc != null) {
								console.log("REGISTER USER FROM FIREBASE: ", userFromDoc);
								setUser(userFromDoc);
							}
						})
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
				//signed in
				/*
				PENDING:  Unsure of need.  Get the role, pass it to userContext???
				Will need something to checkRole i
				const role = await checkRole(userUid);
				*/
				const userID= userCredential.user.uid;
				establishUserContext(userID);
			})
		} catch(e) {
			console.error(e);
			throw e;
		}
	};

	const getCurrentUser = async(): Promise<void> => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				console.log("Signed in: ", uid);
				// ...
			} else {
				console.log("Signed Out");
				// User is signed out
				// ...
			}
		});
	}


	const signOutAuth = async (): Promise<void> => {
		try {
			await signOut(auth);
			setUser(defaultUser);
			console.log("Signed Out!!");
		} catch (e) {
			console.error(e);
			throw e;
		}
	};

	// DELETE USER ??

	const establishUserContext = async(uid: string): Promise<void> => {
		try {
			getUser(uid).then((userFromDoc) => {
				if (userFromDoc != null) {
					console.log("USER FROM FIREBASE: ", userFromDoc);
					setUser(userFromDoc);
				} else {
					console.log("user does not exist");
				}
			})
		} catch (e) {
		}
	}

	return {
		user, 
		register, 
		signIn, 
		signOutAuth,
	};
}

const userContext = createContext({
	user: defaultUser,
  signIn: async (email: string, password: string) => {},
  register: async (email: string, name: string, password: string) => {},
  signOutAuth: () => {},
});

export const UserProvider = ({children}: any) => {
	const auth = useFirebaseAuth();
	return (
		<userContext.Provider value = {auth}> {children} </userContext.Provider>
	)
}

export const useAuth = () => useContext(userContext);