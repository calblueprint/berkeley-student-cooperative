import { doc, collection, addDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../clientApp";
import { User } from "../../types/schema";

export const addUser = async (email: string, houseID: string, name: string, role: string) => {
    const numDigitsInPin = 6
    let pinNumber = Math.floor((Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) + 10 ** (numDigitsInPin - 1)));
    // how to hold passwords?
    // somehow check uniqueness of pin
    const userId = await addDoc(collection(firestore, "users"), {
        availabilities: mapToObject(new Map<string, number[]>()),
        email: email,
        hoursRemainingSemester: 5,
        hoursRemainingWeek: 5,
        house: houseID,
        name: name,
        pinNumber: pinNumber,
        preferences: new Array<string>(),
        role: role,
        shiftsAssigned: new Array<string>(),
        totalFines: 0,
        totalHoursAssigned: 5
    });
    // 
    //  addUserToHouse(user.house, userId);
    console.log(userId);
}

export const updateUser = async (userID: string, fieldName: string, newValue: any) => {
// update doc
}

export const getUser = async (userID: string) => {
    const docRef = doc(firestore, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log(docSnap.data());
    } else {
        console.log("No Document");
    }
}

export const deleteUser = async (userID: string) => {
    await deleteDoc(doc(firestore, "users", userID));
}

const mapToObject = (map: Map<any, any>): Object => {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        v instanceof Map ? [k, mapToObject(v)] : [k, v]
      )
    );
};

const objectToMap = (obj: Object): Map<any, any> => {
    return new Map(
        Array.from(Object.entries(obj), ([k, v]) =>
        v instanceof Object ? [k, objectToMap(v)] : [k, v]
        )
    );
};
  