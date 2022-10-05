import { doc, collection, addDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../clientApp";
import { User } from "../../types/schema";

export const addUser = async (email: string, house: string, name: string, pinNumber: number, role: string) => {
    let user = createUserObject(email, house, name, pinNumber, role);
    const userId = await addDoc(collection(firestore, "users"), {
        availabilities: user.availabilities,
        email: user.email,
        hoursRemainingSemester: user.hoursRemainingSemester,
        hoursRemainingWeek: user.hoursRemainingWeek,
        house: user.houseID,
        name: user.name,
        pinNumber: user.pinNumber,
        preferences: user.preferences,
        role: user.role,
        shiftsAssigned: user.shiftsAssigned,
        totalFines: user.totalFines,
        totalHoursAssigned: user.totalHoursAssigned
    });
    // 
    //  addUserToHouse(user.house, userId);
    console.log(userId);
}

const createUserObject = (email: string, houseID: string, name: string, pinNumber: number, role: string) => {
    let availabilitiesMap = {
        "Monday": new Array<number>(),
        "Tuesday": new Array<number>(),
        "Wednesday": new Array<number>(),
        "Thursday": new Array<number>(),
        "Friday": new Array<number>(),
        "Saturday": new Array<number>(), 
        "Sunday": new Array<number>()
    };
    let user: User = {
        email: email,
        houseID: houseID,
        name: name,
        pinNumber: pinNumber,
        role: role,
        totalFines: 0,
        totalHoursAssigned: 0,
        hoursRemainingSemester: 5,
        hoursRemainingWeek: 5,
        availabilities: availabilitiesMap,
        preferences: new Array<string>(),
        shiftsAssigned: new Array<string>()
    }
    return user;
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