import {firestore} from "../clientApp";
import {Shift} from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
//import {getUser, updateUser} from "userQueries";

export const addShift = async (name: string, description: string, numOfPeople: number, possibleDays: string[], timeWindow: number[], assignedDay: string, hours: number, verificationBuffer: number, category: string) => {
    await addDoc(collection(firestore, "shifts"), {
        name: name,
        description: description,
        possibleDays: possibleDays,
        timeWindow: timeWindow,
        numOfPeople: numOfPeople,
        assignedDay: assignedDay,
        hours: hours,
        verificationBuffer: verificationBuffer,
        usersAssigned: new Array<string>(),
        category: category
    });
}

export const updateShift = async (shiftID: string, newData: object) => {
    const currShift = await getShift(shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "shifts", shiftID);
    await updateDoc(docRef, newData);
}

export const getShift = async (shiftID: string) => {
    const docRef = doc(firestore, "shifts", shiftID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return await parseShift(docSnap);
    }
    // probably replace with modal
    console.log("Invalid Shift ID");
    return null;
}

export const deleteShift = async (shiftID: string) => {
    const currShift = await getShift(shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "shifts", shiftID);
    // const docSnap = await getDoc(docRef);
    // if (!docSnap.exists()) {
    //     return null;
    // }
    // let shift = await parseShift(docSnap);
    // let users = shift.usersAssigned;
    // for (let i = 0; i < users.length; i++) {
    //     let currUserID = users[i];
    //     let currUser = await getUser(currUserID);
    //     const index = currUser.shiftsAssigned.indexOf(shiftID);
    //     if (index > -1) {
    //         currUser.shiftsAssigned.splice(index, 1);
    //         await updateUser(currUserID, {
    //             shiftsAssigned: currUser.shiftsAssigned
    //         });
    //     }
    // }
    await deleteDoc(docRef);
}

const parseShift = async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
    const shiftID = docSnap.id.toString();
    const data = docSnap.data();
    const shift = {
        shiftID: shiftID,
        name: data.name,
        description: data.description,
        possibleDays: data.possibleDays,
        numOfPeople: data.numOfPeople,
        timeWindow: data.timeWindow,
        assignedDay: data.assignedDay,
        hours: data.hours,
        verificationBuffer: data.verificationBuffer,
        usersAssigned: data.usersAssigned,
        category: data.category
    }
    return shift as Shift;
}

