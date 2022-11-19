import { firestore } from "../clientApp";
import { doc, collection, addDoc, getDoc, deleteDoc, setDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { RowOfCSV } from "../../types/schema";

export const addRowOfCSV = async (email: string, firstName: string, lastName: string, houseName: string) => {
    await setDoc(doc(firestore, "csv", email), {
        firstName: firstName,
        lastName: lastName,
        houseName: houseName
    });
}

export const getRowOfCSV = async (email: string) => {
    const docRef = doc(firestore, "csv", email);
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
        houseName: data.house
    }
    return row as RowOfCSV;
}