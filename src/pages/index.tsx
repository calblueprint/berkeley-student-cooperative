import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ShiftAssignmentComponentCard from "./shiftAssignmentComponentCard";
import { addUser, updateUser, getUser } from "../firebase/queries/user";
import { mapToObject } from "../firebase/helpers";
import { addShift } from "../firebase/queries/shift";

const Home: NextPage = () => {
  const shiftID = "iBVA4gOntEGFA4AxpqFU";
  const houseID = "EUC";
  const day = "Monday";
  const id = "123456";

  const createUser = async () => {
    await addUser("hello@gmail.com", houseID, id, "member", id);
    let availabilities = new Map<string, number[]>();
    availabilities.set("Monday", [0, 300]);
    let newData = {
      availabilities: mapToObject(availabilities)
    }
    await updateUser(id, newData);
  }

  const retrieveUser = async () => {
    let obj = await getUser(id);
    console.log(obj);
  }

  const createShift = async () => {
    await addShift(houseID, "Clean Basement", "Clean Basement 1", 3, ["Monday", "Tuesday"], [0, 300], "", 1, 48, "Clean");
  }
  const addUserPreference = async () => {
    let map = new Map<string, number>();
    map.set(shiftID, 2);
    let newData = {
      preferences: mapToObject(map)
    }
    await updateUser(id, newData);  
  }
  
  return (
    <div className={styles.container}>
      <button onClick = {createUser}>Create User</button>
      <button onClick = {retrieveUser}>Get User</button>
      <button onClick = {createShift}>Create Shift</button>
      <button onClick = {addUserPreference}>Add Pref</button>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
      </main>
      <ShiftAssignmentComponentCard day = {day} houseID = {houseID} shiftID = { shiftID }/>
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
