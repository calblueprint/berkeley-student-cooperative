import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import { firestore } from '../clientApp'
import { House, Shift } from '../../types/schema'
import { arrayBuffer } from 'stream/consumers'
import { objectToMap, mapToObject } from '../helpers'

const colRef = collection(firestore, 'houses')

//adding house will be done manually

/**
 * Returns an array of all the houses in the BSC Firebase
 *
 *
 *
 * @returns array containing every house
 *
 * @remark The only time I can see this needing to be called is for the supervisor.
 *
 * @public
 *
 */
export const getAllHouses = async () => {
  const promises: Promise<House>[] = []
  const colSnap = await getDocs(colRef)
  colSnap.forEach((house) => {
    promises.push(parseHouse(house))
  })
  const houses = await Promise.all(promises)
  return houses
}

/**
 * Returns house object dependant on houseID that is passed in.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 *
 * @returns House object containing a snapshot of the house's fields.
 *
 * @public
 *
 */
export const getHouse = async (houseID: string): Promise<House> => {
  try {
    const docRef = await doc(firestore, 'houses', houseID)
    const colSnap = await getDoc(docRef)
    const house = await parseHouse(colSnap)
    return house
  } catch (e) {
    console.warn(e)
    throw e
  }
}
/**
 * Updates a house's address on the firebase.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param newAddress - String that contains a house's new address
 *
 * @remark I do not think we'll really need this, as the coop addresses won't change.
 *
 * @public
 *
 */
export const updateAddress = async (
  houseID: string,
  newAddress: string
): Promise<void> => {
  // TODO: add null checking
  const docRef = doc(firestore, 'houses', houseID)

  const data = {
    address: newAddress,
  }
  await updateDoc(docRef, data)
}

/**
 * Updates house's fields in firebase dependant on houseID that is passed in.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param newData - Object containing data that will be updated on firebase
 *
 *
 *
 * @public
 *
 */
export const updateHouse = async (houseID: string, newData: object) => {
  const currHouse = await getHouse(houseID)
  if (currHouse == null) {
    return
  }
  const houseRef = doc(firestore, 'houses', houseID)
  console.log({ updateHouse: newData, house: houseID })
  await updateDoc(houseRef, newData)
}

/**
 * Adds a category to a house's category field in firebase.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param newCategory - category to be added to the house's category field in the firebase
 *
 *
 * @public
 *
 */
export const addCategory = async (
  houseID: string,
  newCategory: string
): Promise<boolean> => {
  const docRef = doc(firestore, 'houses', houseID)
  const colSnap = await getDoc(docRef)

  //checks if the house id is valid
  if (colSnap.exists()) {
    const promise: Promise<House> = parseHouse(colSnap)
    const house = await promise
    var houseCategories = house.categories

    //checks if category already exists, {} is nested
    if (!houseCategories?.has(newCategory)) {
      // Nested maps -> object
      let newMap = new Map<string, object>()
      houseCategories.forEach((value, key) => {
        newMap.set(key, mapToObject(value))
      })
      // Adds new category
      newMap.set(newCategory, {})
      const data = {
        categories: mapToObject(newMap),
      }
      await updateDoc(docRef, data)
      return true
    } else {
      console.log(
        'The',
        newCategory,
        ' category already exists, use the updateCategory function'
      )
      return false
    }
  } else {
    console.log('invalid house id for add category')
    return false
  }
}

/**
 * Updates a house's category map in the firebase.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param shift - Shift object
 *
 * @remark This method should be called whenever a new shift is created.
 *
 *
 *
 * @public
 *
 */
export const updateCategory = async (
  houseID: string,
  shift: Shift
): Promise<void> => {
  const docRef = doc(firestore, 'houses', houseID)
  const colSnap = await getDoc(docRef)

  //checks if houseId is valid
  if (colSnap.exists()) {
    const promise: Promise<House> = parseHouse(colSnap)
    const house = await promise
    var houseCategories = objectToMap(house.categories)

    //checks if shift is a valid shift object
    if (shift.name && shift.shiftID && shift.category) {
      //checks if category corresponding to shift param is already in the firebase
      if (houseCategories?.has(shift.category)) {
        const currCatMap = objectToMap(houseCategories.get(shift.category))
        //checks if shift already exists in the nested category map
        if (!currCatMap.has(shift.shiftID)) {
          //updates nested category map in firebase to include new shift
          currCatMap.set(shift.shiftID, shift.name)
          houseCategories.set(shift.category, mapToObject(currCatMap))

          const data = {
            categories: mapToObject(houseCategories),
          }
          await updateDoc(docRef, data)
        } else {
          console.log(
            'This shift already exists in the',
            shift.category,
            'category'
          )
        }
      } else {
        //creates a new category map in firebase
        const currCatMap = new Map()

        //adds shift to new category map
        currCatMap.set(shift.shiftID, shift.name)
        houseCategories.set(shift.category, mapToObject(currCatMap))
        const data = {
          categories: mapToObject(houseCategories),
        }
        await updateDoc(docRef, data)
      }
    } else {
      console.log('This is an invalid shift object')
    }
  } else {
    console.log('invalid house id for update category')
  }
}

/**
 * Returns a house's category map.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 *
 * @returns a map that contains nested maps corresponding categories to shifts
 *
 *
 * @public
 *
 */
export const getCategories = async (houseID: string) => {
  const docRef = doc(firestore, 'houses', houseID)

  const colSnap = await getDoc(docRef)

  const promise: Promise<House> = parseHouse(colSnap)
  const house = await promise

  return house.categories
}

/**
 * Removes a shift from a house's category map in the firebase.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param shift - Shift object
 *
 * @remark This method should be called whenever a shift is deleted.
 *
 * @public
 *
 */
export const removeShiftFromCategory = async (
  houseID: string,
  shift: Shift
): Promise<void> => {
  const docRef = doc(firestore, 'houses', houseID)
  const colSnap = await getDoc(docRef)

  //checks if the houseId is a valid house
  if (colSnap.exists()) {
    const promise: Promise<House> = parseHouse(colSnap)
    const house = await promise
    var houseCategories = objectToMap(house.categories)

    //checks if shift is a valid shift object
    if (shift.name && shift.shiftID && shift.category) {
      //checks if categories map contains category corresponding to shift
      if (houseCategories?.has(shift.category)) {
        const currShift = objectToMap(houseCategories.get(shift.category))

        //will delete shift from category if it is there, returns false if shift does not exist in map
        currShift.delete(shift.shiftID)

        //updates categories map in firebase
        houseCategories.set(shift.category, mapToObject(currShift))
        const data = {
          categories: mapToObject(houseCategories),
        }
        await updateDoc(docRef, data)
      } else {
        console.log('this category does not exist')
      }
    } else {
      console.log('This is an invalid shift object')
    }
  } else {
    console.log('invalid house id for remove category')
  }
}

/**
 * Removes a category map from a house's categories map in the firebase.
 *
 * @param houseID - Three letter long code corresponding to certain houses in the BSC.
 * @param oldCategory - Name of category that should be removed from categories map
 *
 *
 * @remark USE SPARINGLY; it will remove entire nested category map including all shifts inside of it
 *
 *
 * @public
 *
 */
export const removeCategory = async (
  houseID: string,
  oldCategory: string
): Promise<void> => {
  const docRef = doc(firestore, 'houses', houseID)
  const colSnap = await getDoc(docRef)

  //checks if houseId is a valid house
  if (colSnap.exists()) {
    const promise: Promise<House> = parseHouse(colSnap)
    const house = await promise
    var houseCategories = objectToMap(house.categories)

    //checks if category exists
    if (houseCategories?.has(oldCategory)) {
      //if the categories map it removes the entire map of oldCategory, containing everything inside it
      houseCategories.delete(oldCategory)
      const data = {
        categories: mapToObject(houseCategories),
      }
      await updateDoc(docRef, data)
    } else {
      console.log('The', oldCategory, ' category does not exist')
    }
  } else {
    console.log('invalid house id for add category')
  }
}

//parses house document passed in

const parseHouse = async (doc: any) => {
  const data = doc.data()
  const houseID = doc.id.toString()
  const members = data.members
  const address = data.address
  const categories = data.categories
  const schedule = data.schedule
  const userPINs = data.userPINs
  let categMap = objectToMap(categories)
  let newMap = new Map<string, Map<string, string>>()
  categMap.forEach((value, key) => {
    newMap.set(key, objectToMap(value))
  })
  const house = {
    houseID: houseID,
    categories: newMap,
    members: members,
    address: address,
    // schedule somehow already a map
    schedule: schedule,
    userPINs: objectToMap(userPINs),
  }
  return house as House
}

export const defaultHouse: House = {
  houseID: '',
  categories: new Map<string, Map<string, string>>(),
  members: new Array<string>(),
  address: '',
  schedule: new Map<string, string[]>(),
  userPINs: new Map<string, string>(),
}
