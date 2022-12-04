import {firestore} from "../clientApp";
import {Shift, VerifiedShift} from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc, getDocs, Timestamp } from "firebase/firestore";
import { firestoreAutoId, parseTime } from "../helpers";
import { FirebaseError } from "firebase/app";

export const addShift = async (houseID: string, name: string, description: string, numOfPeople: number, possibleDays: string[], timeWindow: number[], assignedDay: string, hours: number, verification: boolean, verificationBuffer: number, category: string) => {
    await addDoc(collection(firestore, "houses", houseID, "shifts"), {
        name: name,
        description: description,
        possibleDays: possibleDays,
        timeWindow: timeWindow,
        numOfPeople: numOfPeople,
        assignedDay: assignedDay,
        hours: hours,
        verification: verification,
        verificationBuffer: verificationBuffer,
        usersAssigned: new Array<string>(),
        category: category
    });
}

export const updateShift = async (houseID: string, shiftID: string, newData: object) => {
    const currShift = await getShift(houseID, shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
    await updateDoc(docRef, newData);
}

export const getShift = async (houseID: string, shiftID: string) => {
    // const docRef = doc(firestore, "houses", "EUC", "shifts", "dhWWmgzM1MISFWyblp8J");
    const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return await parseShift(docSnap);
    } 
    // probably replace with modal
}

export const getNumVerified = async (houseID: string, shiftID: string): Promise<number> => {
    console.log("Getting num verified");
    const verShiftsRef = await collection(firestore, "houses", houseID, "shifts", shiftID, "verifiedShifts");
    const snap = await getDocs(verShiftsRef);
    return snap.size;
}



export const deleteShift = async (houseID: string, shiftID: string) => {
    const currShift = await getShift(houseID, shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
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
        verification: data.verification,
        verificationBuffer: data.verificationBuffer,
        usersAssigned: data.usersAssigned,
        category: data.category
    }
    return shift as Shift;
}

export const getVerifiedShifts = async (houseID: string, shiftID: string): Promise<Map<string, VerifiedShift>> => {
    const colRef = collection(firestore, "houses", houseID, "shifts", shiftID, "verifiedShifts");
    const verifiedShiftMap = new Map<string, VerifiedShift>();
    const colSnap = await getDocs(colRef);
    colSnap.forEach(doc => {
        let verifiedShift = parseVerifiedShift(doc);
        verifiedShiftMap.set(verifiedShift.shifterID, verifiedShift);
    })
    return verifiedShiftMap;
}

const parseVerifiedShift = (docSnap: QueryDocumentSnapshot<DocumentData>): VerifiedShift => {
    const autoID = docSnap.id.toString();
    const data = docSnap.data();
    let dateObj = data.timeStamp.toDate();
    let time = parseTime(dateObj.getHours() * 100 + dateObj.getMinutes());
    const verifiedShift: VerifiedShift = {
        autoID: autoID,
        timeStamp: time,
        shifterID: data.shifterID,
        verifierID: data.verifierID
    }
    return verifiedShift;
}

export const verifyShift = async (verifierID: String, shifterID: String, shiftID: string, houseID: string) => {
    let timeStamp = new Date();
    console.log("Call Verify Shift Once");
    let autoID = firestoreAutoId();
    console.log(timeStamp);
    await setDoc(doc(firestore, "houses", houseID, "shifts", shiftID, "verifiedShifts", autoID), {
        autoID: autoID,
        timeStamp: Timestamp.fromDate(timeStamp),
        shifterID: shifterID,
        verifierID: verifierID
    })
  }