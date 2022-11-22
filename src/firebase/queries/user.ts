import { firestore } from "../clientApp";
import { User } from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { mapToObject, objectToMap } from "../helpers";
import { getHouse, updateHouse } from "./house";

export const addUser = async (email: string, houseID: string, last_name: string, first_name: string, role: string, userID: string) => {
    const currHouse = await getHouse(houseID);
    let currHouseMap = currHouse.userPINs;
    console.log({currHouseMap: currHouseMap});
    let pinNumber = generatePinNumber(5);
    do {
        pinNumber = generatePinNumber(5);
    } while (currHouseMap.has(pinNumber));
    console.log({pinNumber: pinNumber});
    await setDoc(doc(firestore, "users", userID), {
        availabilities: mapToObject(new Map<string, number[]>()),
        email: email,
        hoursRemainingSemester: 5,
        hoursRemainingWeek: 5,
        houseID: houseID,
        last_name: last_name,
        first_name: first_name,
        pinNumber: pinNumber,
        preferences: new Array<string>(),
        role: role,
        shiftsAssigned: new Array<string>(),
        totalFines: 0,
        totalHoursAssigned: 5
    });
    let houseMems = currHouse.members;
    if (houseMems) {
        houseMems.push(userID);
    }
    currHouseMap.set(pinNumber, userID);
    let newData = {
        members: currHouse.members,
        pinUserMap: mapToObject(currHouseMap)
    }
    console.log({newUserID: userID, PIN: pinNumber, newData: newData, houseID: houseID});
    await updateHouse(houseID, newData);
}

const generatePinNumber = (numDigitsInPin: number) => {
    return Math.floor((Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) + 10 ** (numDigitsInPin - 1)));
}


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
        last_name: data.last_name,
        first_name: data.first_name,
        email: data.email,
        houseID: data.houseID,
        hoursAssigned: data.hoursAssigned,
        hoursRequired: data.hoursRequired,
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
    await deleteDoc(doc(firestore, "users", userID));
}

export const assignShiftToUser = async (userID: string, shiftID: string) => {
    const currUser = await getUser(userID);
    if (currUser === null) {
        return;
    }
    currUser.shiftsAssigned.push(shiftID);
    let newData = {
        shiftsAssigned: currUser.shiftsAssigned
    }
    await updateUser(userID, newData);
}

export const defaultUser: User = {
	userID: "",
	role: "",
	last_name: "",
  first_name: "",
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
