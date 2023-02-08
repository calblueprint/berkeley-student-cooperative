import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { firestore } from '../clientApp'

export const getHouses = async () => {
  const colRef = collection(firestore, 'houses')
  const colSnap = await getDocs(colRef)

  colSnap.forEach((doc) => {
    console.log(doc.id, doc.data())
  })
}

getHouses() // to test, call getHouses() in a page
