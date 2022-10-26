import { collection, addDoc, updateDoc, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { firestore } from "../clientApp";
import { House } from "../../types/schema";
import { arrayBuffer } from "stream/consumers";


const colRef = collection(firestore, "houses");

//adding house will be done manually



//grabs all houses from database
export const getAllHouses = async()  => {
    
    const promises: Promise<House>[] = []; 
    const colSnap = await getDocs(colRef);
    colSnap.forEach((house) => {
        promises.push(parseHouse(house));
    })
    const houses = await Promise.all(promises);
    return houses;

}


//grabs a specific house from database
export const getHouse = async(houseID: string)  => {
    const docRef = doc(firestore, "houses", houseID);

    const colSnap = await getDoc(docRef);
  
    const promise: Promise<House> = parseHouse(colSnap);
    const house = await promise;

    return house;

}


//updating the fields of house, may not be useful ?
export const updateAddress = async (houseID: string, newAddress: string): Promise<void> => {
    // TODO: add null checking
    const docRef = doc(firestore, "houses", houseID);

    const data = {
        address: newAddress
    }
    await updateDoc(docRef, data)
}

//adds a value to the categories array
export const addCategory = async (houseID: string, newCategory: string): Promise<void> => {
    const docRef = doc(firestore, "houses", houseID);
    const colSnap = await getDoc(docRef);
  
    const promise: Promise<House> = parseHouse(colSnap);
    const house = await promise;
    var newCategories = house.categories
    
    //checks if category already exists
    const index = newCategories?.indexOf(newCategory);
    if (index == -1 ){
        if (!newCategories){
            newCategories = [newCategory]
        } else {
            newCategories?.push(newCategory)
        }
        
    }
    
    const data = {
        categories: newCategories
    }
    await updateDoc(docRef, data)
}

export const removeCategory = async (houseID: string, oldCategory: string): Promise<void> => {
    const docRef = doc(firestore, "houses", houseID);
    const colSnap = await getDoc(docRef);
  
    const promise: Promise<House> = parseHouse(colSnap);
    const house = await promise;
    var newCategories = house.categories

    const index = newCategories?.indexOf(oldCategory);
    if (index !== -1 && index){
        
        newCategories?.splice(index, 1)
    }
    const data = {
        categories: newCategories
    }
    await updateDoc(docRef, data)
}


export const getCategories = async (houseID: string) => {
    const docRef = doc(firestore, "houses", houseID);

    const colSnap = await getDoc(docRef);
 
        const house =  await parseHouse(colSnap);
        return house.categories;
    
    // console.log("Invalid House ID")
    // return null;
}


//address schedule field when shifts are all done


//parses house document passed in
const parseHouse = async (doc : any) => {
    const data = doc.data();
    const houseID = doc.id;
    const members = doc.members;
    const address = data.address;
    const categories = data.categories;
    const schedule = data.schedule;
    const house = {houseID, members, address, schedule, categories};
    return house as House;
}


//confirm how members array is going to work before trying to implement
// how will we be parsing through the csv file ? is that how we are going to create the members list

//main issue im running into is error handling for when the member array comes back as undefined,



// export const addMember = async (houseID: string, newMember: string): Promise<void> => {
//     const docRef = doc(firestore, "houses", houseID);
//     // const promises: Promise<House>[] = []; 
//     // const colSnap = await getDoc(docRef);
//     // promises.push(parseHouse(colSnap));
    
//     const colSnap = await getDoc(docRef);
    
//     var addedMembers = (await parseHouse(colSnap)).members;
    

//     addedMembers?.push(newMember)
//     const data = {
//         members: addedMembers
//     }
//     await updateDoc(docRef, data)
// }
// export const deleteMember = async (houseID: string, oldMember: string) => {
//     const docRef = doc(firestore, "houses", houseID);

//     const promises: Promise<House>[] = []; 
//     const colSnap = await getDoc(docRef);
//     promises.push(parseHouse(colSnap));
//     const houseMembers = (await promises[0]).members;
//     const index = houseMembers?.indexOf(oldMember);
//     if (index !== -1 && index){
//         houseMembers?.splice(index, 1)
//     }
//     const data = {
//         members: houseMembers
//     }

//     await updateDoc(docRef, data);
// }


//applies to comments above, but goes in index.tsx
  // const addMemberFB = async (houseID :string, newMember:string) =>{
  //   var addAMember = await addMember(houseID, newMember);
  //   console.log("added member", newMember);
  // }
  // const removeMemberFB = async (houseID :string, oldMember:string) =>{
  //   var rmAMember = await deleteMember(houseID, oldMember);
  //   console.log("removed member", rmAMember);
  // }

    //gets all houses from firebase
    // const getAllHouseFB = async () =>{
    //     var fireHouse = await getAllHouses();
    //     setHouses(fireHouse);
    //   }
    //   //gets specific house from firebase, must specify certain house
    //   const getHouseFB = async (houseID :string) =>{
    //     var fireAHouse = await getHouse(houseID);
    //     setCurrHouse(fireAHouse);
    //   }