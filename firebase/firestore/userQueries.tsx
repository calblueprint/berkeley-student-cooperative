import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../clientApp";
import { User } from "../../types/schema";

//     // probably creating the user on signup/signin so parameters for this function will just be the new user

//     // how to hold passwords?
//     // somehow check uniqueness of pin

//     // map to json / map to object before upload
//     // store arrays as string?
//     // userID must match the registration

export const addUser = async (email: string, houseID: string, name: string, role: string) => {
    let pinNumber = generatePinNumber(6);
    const userId = await addDoc(collection(firestore, "users"), {
        availabilities: mapToJSON(new Map<string, number[]>()),
        email: email,
        hoursRemainingSemester: 5,
        hoursRemainingWeek: 5,
        houseID: houseID,
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

const generatePinNumber = (numDigitsInPin: number) => {
    return Math.floor((Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) + 10 ** (numDigitsInPin - 1)));
}
// }

// newData has updated fields
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
        preferences: data.preferences
    }
    return user as User;
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
  
const mapToJSON = (map: Map<any, any>): string => {
    return JSON.stringify(mapToObject(map));
}