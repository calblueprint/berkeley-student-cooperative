import { collection, addDoc, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../clientApp";
import { House } from "../../types/schema";


const colRef = collection(firestore, "houses");


//grabs all houses from database
export const getAllHouses = async(): Promise<House[]>  => {
    
    const promises: Promise<House>[] = []; 
    const colSnap = await getDocs(colRef);
    colSnap.forEach((house) => {
        promises.push(parseHouse(house));
    })
    const houses = await Promise.all(promises);
    return houses;

}


//grabs a specific house from database
export const getHouse = async(houseID: string): Promise<House[]>  => {
    
    const docRef = doc(firestore, "houses", houseID);
    const promises: Promise<House>[] = []; 
    const colSnap = await getDoc(docRef);
  
    promises.push(parseHouse(colSnap));

    const houses = await Promise.all(promises);

    return houses;

}


//updating the fields of house
export const updateMembers = async (house: House, newMember: string): Promise<void> => {
    const docRef = doc(firestore, "houses", house.houseID);

    const addedMembers = house.members;
    addedMembers?.push(newMember)
    const data = {
        members: addedMembers
    }
    await updateDoc(docRef, data)
}

export const updateAddress = async (house: House, newAddress: string): Promise<void> => {
    const docRef = doc(firestore, "houses", house.houseID);

    const data = {
        address: newAddress
    }
    await updateDoc(docRef, data)
}


//address schedule field when shifts are all done


//parses house document passed in
const parseHouse= async (doc : any) => {
    const data = doc.data();
    const houseID = doc.id;
    const members = doc.members;
    const address = data.address;
    const schedule = data.schedule;
    const house = {houseID, members, address, schedule};
    return house as House;
}