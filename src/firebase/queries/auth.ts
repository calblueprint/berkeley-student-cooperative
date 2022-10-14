import { getAuth, createUserWithEmailAndPassword, getAdditionalUserInfo, signInWithEmailAndPassword, signOut } from "firebase/auth";



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
    console.log("Email: ", email, " Password: ", password, " Name: ", name);
    console.log("AUTH", auth);
    try {
        //PENDING: Search for email in CSV once this func is available.
        console.log("Email: ", email, " Password: ", password, " Name: ", name);
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
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

        })
    } catch(e) {
      console.error(e);
      throw e
    }
};

export const signIn = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    console.log("Email: ", email, " Password: ", password);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("SUCCESS");
      //signed in
      /*
      PENDING:  Unsure of need.  Get the role, pass it to userContext???
      Will need something to checkRole i
      const role = await checkRole(userUid);
      */
      const userUid = userCredential.user.uid;
    }).catch ((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  })
  } catch(e) {
    console.error(e);
    throw e;
  }
};


export const signOutAuth= async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error(e);
    throw e;
  }
};