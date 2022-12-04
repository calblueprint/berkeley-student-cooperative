import { firestore } from "../clientApp";
import { User } from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { mapToObject, objectToMap } from "../helpers";
import { getHouse, updateHouse } from "./house";
import { generatePinNumber } from "../helpers";

/**
 * Adds a user to a house and generates a pin for them. Called through auth register when a user creates their account.
 * Updates the house's list of users and the house's userPINs
 * @param email - The user's email
 * @param houseID - The user's houseID
 * @param firstName - First Name
 * @param lastName - Last Name
 * @param role - The user's role
 * @param userID - The userID assigned to this user in auth
*/
export const addUser = async (email: string, houseID: string, firstName: string, lastName: string, role: string, userID: string) => {
    const currHouse = await getHouse(houseID);
    // TODO: update userPINs of house (not sure if we can assume it exists yet/if we should make new obj if dne)
    // let currHouseMap = currHouse.userPINs;
    // do {
    //     var pinNumber = generatePinNumber(5);
    // } while (currHouseMap.has(pinNumber));
    let pinNumber = generatePinNumber(5);
    await setDoc(doc(firestore, "users", userID), {
        availabilities: mapToObject(new Map<string, number[]>()),
        email: email,
        hoursRemainingSemester: 5,
        hoursRemainingWeek: 5,
        houseID: houseID,
        firstName: firstName,
        lastName: lastName,
        pinNumber: pinNumber,
        preferences: mapToObject(new Map<string, number>()),
        role: role,
        shiftsAssigned: new Array<string>(),
        totalFines: 0,
        hoursAssigned: 0,
        hoursRequired: 5
    });
    let members = currHouse.members;
    if (members == null) {
        members = new Array<string>();
    }
    if (!members.includes(userID)) {
        members.push(userID);
    }
    // currHouseMap.set(pinNumber, userID);
    let newData = {
        members: currHouse.members,
        // userPINs: currHouseMap
    }
    updateHouse(houseID, newData);
}


/**
 * Updates a user object with newData. If updating a map, it must be converted
 * to an object before this is called.
 * @param newData - An object containing the newData that will be uploaded to Firebase
 * @param userID - The userID assigned to this user in auth
*/
export const updateUser = async (userID: string, newData: object) => {
    const currUser = await getUser(userID);
    if (currUser == null) {
        return;
    }
    const userRef = doc(firestore, 'users', userID);
    await updateDoc(userRef, newData);
}

/**
 * Gets a user with the userID from Firebase and returns a user object. Calls parseUser.
 * @param userID - The ID of the user.
 * @returns A User object or null if the UserID is invalid
*/
export const getUser = async (userID: string) => {
    try {
        const docRef = doc(firestore, "users", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return await parseUser(docSnap);
        }
        //replace w modal
        console.log("Invalid User ID");
        return null;
    } catch (e) {
        console.log(e);
    }
    
}

// Used internally; parses the user data from Firebase into a user object
const parseUser = async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
    const userID = docSnap.id.toString();
    const data = docSnap.data();
    const user = {
        userID: userID,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        houseID: data.houseID,
        hoursRequired: data.hoursRequired,
        hoursAssigned: data.hoursAssigned,
        shiftsAssigned: data.shiftsAssigned,
        hoursRemainingWeek: data.hoursRemainingWeek,
        hoursRemainingSemester: data.hoursRemainingSemester,
        pinNumber: data.pinNumber,
        totalFines: data.totalFines,
        availabilities: objectToMap(data.availabilities),
        preferences: objectToMap(data.preferences)
    }
    return user as User;
}

/**
 * Deletes a user with a userID
 * @param userID - The userID assigned to this user in auth
*/
export const deleteUser = async (userID: string) => {
    // TODO: delete user from all instances of shifts (all shifts that the user has been assigned to)
    // TODO: delete user from their house's userPINs and member list
    const user = await getUser(userID);
    if (user == null) {
        return;
    }
    await deleteDoc(doc(firestore, "users", userID));
}

export const defaultUser: User = {
	userID: "",
	role: "",
	firstName: "",
  lastName: "",
	email: "",
	houseID: "",
	hoursAssigned: 0,
  hoursRequired: 5,
	shiftsAssigned: new Array<string>(),
	hoursRemainingWeek: 0,
	hoursRemainingSemester: 0,
	pinNumber: 0,
	totalFines: 0,
	availabilities: new Map<string, number[]>(),
	preferences: new Map<string, number>(),
};