import { firestore } from "../clientApp";
import { User } from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { mapToObject, objectToMap } from "../helpers";

export const addUser = async (email: string, houseID: string, name: string, role: string, userID: string) => {
    // PENDING COMPLETION OF HOUSE QUERIES
    // const houseDocRef = doc(firestore, "houses", houseID);
    // const houseDocSnap = await getDoc(houseDocRef);
    // const currHouse = await parseHouse(houseDocSnap);
    // let currHouseMap = currHouse.pinUserMap;
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
        name: name,
        pinNumber: pinNumber,
        preferences: mapToObject(new Map<string, number>()),
        role: role,
        shiftsAssigned: new Array<string>(),
        totalFines: 0,
        totalHoursAssigned: 5
    });
    // PENDING COMPLETION OF HOUSE QUERIES
    // currHouse.members.push(userID);
    // currHouseMap.set(pinNumber, userID);
    // let newData = {
    //     members: currHouse.members,
    //     pinUserMap: currHouseMap
    // }
    // updateHouse(currHouse.houseID, newData);
}

const generatePinNumber = (numDigitsInPin: number) => {
    return Math.floor((Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) + 10 ** (numDigitsInPin - 1)));
}


// data must be passed in availabilities: mapToObject
export const updateUser = async (userID: string, newData: object) => {
    const currUser = await getUser(userID);
    if (currUser == null) {
        return;
    }
    const userRef = doc(firestore, 'users', userID);
    await updateDoc(userRef, newData);
}

export const getUser = async (userID: string) => {
    const docRef = doc(firestore, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return await parseUser(docSnap);
    }
    //replace w modal
    console.log("Invalid User ID");
    return null;
}

const parseUser = async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
    const userID = docSnap.id.toString();
    const data = docSnap.data();
    const user = {
        userID: userID,
        role: data.role,
        name: data.name,
        email: data.email,
        houseID: data.houseID,
        totalHoursAssigned: data.totalHoursAssigned,
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
    const currUser = await getUser(userID);
    if (currUser == null) {
        return;
    }
    // delete user from all instances of shifts
    const user = await getUser(userID);
    if (user == null) {
        return;
    }
    await deleteDoc(doc(firestore, "users", userID));
}

export const assignShiftToUser = async (userID: string, shiftID: string) => {
    const currUser = await getUser(userID);
    if (currUser === null || currUser.shiftsAssigned.includes(shiftID)) {
        return;
    }
    currUser.shiftsAssigned.push(shiftID);
    let newData = {
        shiftsAssigned: currUser.shiftsAssigned
    }
    await updateUser(userID, newData);
}

export const unassignShiftToUser = async (userID: string, shiftID: string) => {
    const currUser = await getUser(userID);
    if (currUser === null) {
        return;
    }
    let copy = [...currUser.shiftsAssigned];
    let index = copy.indexOf(shiftID);
    if (index == -1) {
        return;
    }
    copy.splice(index, 1);
    let newData = {
        shiftsAssigned: copy
    }
    console.log(copy);
    await updateUser(userID, newData);
}