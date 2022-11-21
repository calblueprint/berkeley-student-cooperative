import { firestore } from "../clientApp";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { RowOfCSV } from "../../types/schema";

let collectionName = "authorizedUsers";

export const addRowOfCSV = async (email: string, firstName: string, lastName: string, houseID: string) => {
    await setDoc(doc(firestore, collectionName, email), {
        firstName: firstName,
        lastName: lastName,
        houseID: houseID
    });
}

export const getRowOfCSV = async (email: string) => {
    const docRef = doc(firestore, collectionName, email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return await parseUser(docSnap, email);
    }
    return null;
}

const parseUser = async (docSnap: QueryDocumentSnapshot<DocumentData>, email: string) => {
    const data = docSnap.data();
    const row = {
        email: email,
        firstName: data.firstName,
        lastName: data.lastName,
        houseID: data.houseID
    }
    return row as RowOfCSV;
}