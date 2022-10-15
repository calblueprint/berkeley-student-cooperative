import { getAuth, createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import { addUser, getUser } from "./userQueries";



//managers don't have to register.  House will be matched to email
//userID is going to get generated in register.
/*
    1. Have them register
    2. Check the email used in register, match it to an email in a csv
    3. Retrieve the House from this CSV
    4. If this works, continue and generate a userID
    5. Pass all of this info to addUser.
*/

const auth = getAuth();

export const register = async (
    email: string,
    name: string,
    password: string
): Promise<void> => {
    try {
        //PENDING: Search for email in CSV once this func is available.
        createUserWithEmailAndPassword(auth, email, password )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Created User:", user);
          /* 
            Signed in
            PENDING Completion of addUser
            PENDING Role is automatically resident/ not Manager
            PENDING HouseID found in csv
            addUser(email, houseID, name, role, user.uid)
          */
         addUser(email, "Euclid", name, "Member", user.uid).then(() => {
          establishUserContext(user.uid);
          getUser(user.uid).then((userFromDoc) => {
            if (userFromDoc != null) {
              console.log("USER FROM FIREBASE: ", userFromDoc);
              /*
              PLUG USER CONTEXT HERE:
              Using userFromFirebase
              */
            }
          })
         });
        })
    } catch(e) {
      console.error(e);
      throw e
    }
};

export const signIn = async (
  email: string,
  password: string
) => {
  try {
    console.log("Email: ", email, " Password: ", password);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //signed in
      /*
      PENDING:  Unsure of need.  Get the role, pass it to userContext???
      Will need something to checkRole i
      const role = await checkRole(userUid);
      */
      const userID= userCredential.user.uid;
      establishUserContext(userID);
    })
  } catch(e) {
    console.error(e);
    throw e;
  }
};

export const getCurrentUser = async(): Promise<void> => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log("Signed in: ", uid);
      // ...
    } else {
      console.log("Signed Out");
      // User is signed out
      // ...
    }
  });
}


export const signOutAuth= async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Signed Out!!");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const establishUserContext = async(uid: string): Promise<void> => {
  try {
    getUser(uid).then((userFromDoc) => {
      if (userFromDoc != null) {
        console.log("USER FROM FIREBASE: ", userFromDoc);
        /*
        PLUG USER CONTEXT HERE:
        Using userFromFirebase
        */
      }
    })
  } catch (e) {
  }
}