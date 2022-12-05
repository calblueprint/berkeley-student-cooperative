import {firestore} from "../clientApp";
import {Shift, VerifiedShift} from "../../types/schema";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc, getDocs, Timestamp } from "firebase/firestore";
import { firestoreAutoId, parseTime } from "../helpers";
import { FirebaseError } from "firebase/app";

/**
 * Adds a shift. Used when a manager creates a shift.
 * @param houseID - ID of house
 * @param name - The name of the shift
 * @param description - The description of the shift
 * @param numOfPeople - The number of people needed to complete the shift
 * @param possibleDays - A list of days the shift can be completed on
 * @param hours - The number of hours earned for completing the shift
 * @param timeWindow - The time window for a shift
 * @param assignedDay - The day that the shift has been assigned (may be "" if not assigned a specific day yet)
 * @param category - The category the shift belongs to
 * @param verification
 * @param verificationBuffer - The number of hours after shift end that the user has to verify their shift
*/
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

export const getAllShiftsInCategory = async (houseID: string, category: string) => {
    const querySnapshot = await getDocs(collection(firestore, "houses", houseID, "shifts"));
    let returnObj: Shift[] = [];
    querySnapshot.forEach(async (docSnap) => {
        let currShift = await parseShift(docSnap);
        if (currShift.category === category) {
            returnObj.push(currShift);
        }
    })
    return returnObj;
}

export const getAllShifts = async (houseID: string) => {
    try{
        const querySnapshot = await getDocs(collection(firestore, "houses", houseID, "shifts"));
        let returnObj: Shift[] = [];
        querySnapshot.forEach(async (docSnap) => {
            let currShift = await parseShift(docSnap);
            returnObj.push(currShift);
        })
        return returnObj;
    } catch(e) {
        console.log(e);
    }
   
}

/************************************************************* */
/** This function gets all shifts from a house with houseID */
export const getAllShift = async (houseID: string) => {
    try{
         // const docRef = doc(firestore, "houses", "EUC", "shifts", "dhWWmgzM1MISFWyblp8J");
        const colRef = collection(firestore, "houses", houseID, "shifts");
    
        const promises: Promise<Shift>[] = [];
        const colSnap = await getDocs(colRef);
        colSnap.forEach((shift) => {
        promises.push(parseShift(shift));
        })
        const shfits = await Promise.all(promises);
        return shfits;
        // probably replace with modal
    } catch(e) {
        console.log(e);
    }

  };
  /************************************************************* */

/**
 * Updates a shift object with newData.
 * @param newData - An object containing the newData that will be uploaded to Firebase
 * @param houseID - The ID of the house
 * @param shiftID - The ID of the shift
*/
export const updateShift = async (houseID: string, shiftID: string, newData: object) => {
    const currShift = await getShift(houseID, shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
    await updateDoc(docRef, newData);
}

/**
 * Gets a shift with the shiftID from Firebase and returns a shift object. Calls parseShift.
 * @param shiftID - The ID of the shift
 * @param houseID - The ID of the house
 * @returns A Shift object or null if the shiftID is invalid
*/
export const getShift = async (houseID: string, shiftID: string) => {
    // const docRef = doc(firestore, "houses", "EUC", "shifts", "dhWWmgzM1MISFWyblp8J");
    try {
        const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return await parseShift(docSnap);
        } 
        // probably replace with modal
    } catch (error) {
        console.log(error);
    }
    
}

export const getNumVerified = async (houseID: string, shiftID: string): Promise<number> => {
    console.log("Getting num verified");
    const verShiftsRef = await collection(firestore, "houses", houseID, "shifts", shiftID, "verifiedShifts");
    const snap = await getDocs(verShiftsRef);
    return snap.size;
}
export const getShiftForCategories = async (houseID: string, category: string): Promise<Shift[]> => {
    const colRef = collection(firestore, "houses", houseID, "shifts");
    const promises: Promise<Shift>[] = []; 
    const docSnap = await getDocs(colRef);
    docSnap.forEach((shift) => {
        promises.push(parseShift(shift));
    })

    const items = await Promise.all(promises);
    return items;
    return [];
}


/**
 * Deletes a shift with a shiftID in houseID
 * @param shiftID - The ID of the shift
 * @param houseID - The ID of the house
*/
export const deleteShift = async (houseID: string, shiftID: string) => {
    const currShift = await getShift(houseID, shiftID);
    if (currShift == null) {
        return;
    }
    const docRef = doc(firestore, "houses", houseID, "shifts", shiftID);
    // TODO: unassign the shifts that the user has been assigned to
    // TODO: remove shift ID from users' preference map (not sure if necessary)
    // - still must keep shift for verification maybe?? not sure what happens when delete
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

// Used internally; parses the shift data from Firebase into a shift object
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