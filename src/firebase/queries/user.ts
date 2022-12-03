import { firestore } from "../clientApp";
import { User } from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { objectToMap, mapToObject } from "../helpers";
import { getHouse, updateHouse } from "./house";
export const addUser = async (email: string, houseID: string, firstName: string, lastName: string, role: string, userID: string) => {
    const currHouse = await getHouse(houseID);
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

const generatePinNumber = (numDigitsInPin: number) => {
    return Math.floor((Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) + 10 ** (numDigitsInPin - 1)));
}


// data must be passed in availabilities: mapToObject
export const updateUser = async (userID: string, newData: object) => {
    const userRef = doc(firestore, 'users', userID);
    await updateDoc(userRef, newData);
}

export const getUser = async (userID: string) => {
    const docRef = doc(firestore, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return await parseUser(docSnap);
    }
    return null;
}

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

export const deleteUser = async (userID: string) => {
    // delete user from all instances of shifts
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