import { firestore } from '../clientApp'
import {
  doc,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { RowOfCSV } from '../../types/schema'

let collectionName = 'authorizedUsers'

// Adds a row of the CSV to the Firebase under authorizedUsers; document id = email
export const addRowOfCSV = async (
  email: string,
  firstName: string,
  lastName: string,
  houseID: string
) => {
  let user = await getRowOfCSV(email)
  if (user !== null) {
    return
  }
  console.log(houseID)
  console.log(email)
  console.log(firstName)
  console.log(lastName)
  await setDoc(doc(firestore, collectionName, email), {
    firstName: firstName,
    lastName: lastName,
    houseID: houseID,
    accountCreated: false,
  })
}

// Retrieves a document in Firebase under authorizedUsers with the documentId = email
export const getRowOfCSV = async (email: string) => {
  const docRef = doc(firestore, collectionName, email)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return await parseUser(docSnap, email)
  }
  return null
}

// Updates a row of the CSV
export const updateRowOfCSV = async (email: string, newData: object) => {
  const userRef = doc(firestore, collectionName, email)
  await updateDoc(userRef, newData)
}

const parseUser = async (
  docSnap: QueryDocumentSnapshot<DocumentData>,
  email: string
) => {
  const data = docSnap.data()
  const row = {
    email: email,
    firstName: data.firstName,
    lastName: data.lastName,
    houseID: data.houseID,
    accountCreated: data.accountCreated,
  }
  return row as RowOfCSV
}
