import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ShiftAssignmentComponentCard from "./shiftAssignmentComponentCard";
import { addUser, updateUser, getUser } from "../firebase/queries/user";
import { mapToObject } from "../firebase/helpers";

const Home: NextPage = () => {
  const shiftID = "dvIP6CZVL6CCYLVB0VPg";
  const houseID = "euclid"; //capitalization
  const day = "Monday";

  const createUser = async () => {
    let id = "123";
    await addUser("hello@gmail.com", "euclid", "eligible", "member", id);
    let availabilities = new Map<string, number[]>();
    availabilities.set("Monday", [0, 300]);
    let newData = {
      availabilities: mapToObject(availabilities)
    }
    await updateUser(id, newData);
  }

  const retrieveUser = async () => {
    let obj = await getUser("123");
    console.log(obj);
  }

  return (
    <div className={styles.container}>
      <button onClick = {createUser}>Create User</button>
      <button onClick = {retrieveUser}>Get User</button>
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
