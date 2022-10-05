import { collection, addDoc } from "firebase/firestore";
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
        availabilities: new Map<any, any>(),
        preferences: [],
        shiftsAssigned: []
    }
    return user;
}