import type { NextPage } from "next";
import Head from "next/head";
import { firestore } from "../firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "@firebase/firestore";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getHouses } from "../firebase/queries/exampleQuery";
import { getCurrentUser, register, signIn, signOutAuth} from '../firebase/queries/auth'
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/userQueries';

const Home: NextPage = () => {

  const createUser = async () => {
    addUser("bsc@berkeley.edu", "Euclid", "Sean", "Manager", firestoreAutoId());
  }

  const firestoreAutoId = (): string => {
    const CHARS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";
    for (let i = 0; i < 20; i += 1) {
      autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
  };
  


  const retrieveUser = async () => {
    let x = await getUser("mc8XQK7aiZW1dg8IC8v5");
    if (x != null) {
      console.log(x.availabilities);
      console.log(x.shiftsAssigned);
    }
  }

  const removeUser = async () => {
    deleteUser("mc8XQK7aiZW1dg8IC8v5");//naming conflicts of subfct is same name as overall fct
  }
  
  const setUser = async () => {
    let availabilities = new Map<string, Array<number>>();
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (let i = 0; i < days.length; i++) {
      let newList = new Array<number>();
      newList.push(0);
      newList.push(2330);
      availabilities.set(days[i], newList);
    }
    let newData = {
      availabilities: mapToObject(availabilities)
    }
    updateUser("mc8XQK7aiZW1dg8IC8v5", newData);
  }

  const addShiftToUser = async () => {
    await assignShiftToUser("mc8XQK7aiZW1dg8IC8v5", "1");
    await retrieveUser();
  }


  const mapToObject = (map: Map<any, any>): Object => {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        v instanceof Map ? [k, mapToObject(v)] : [k, v]
      )
    );
  };

  const objectToMap = (obj: Object): Map<any, any> => {
    return new Map(
        Array.from(Object.entries(obj), ([k, v]) =>
        v instanceof Object ? [k, objectToMap(v)] : [k, v]
        )
    );
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={() => signIn("dummy@gmail.com", "birdsRFake22")}>SIGN IN</button>
      <button onClick={() => register("dummy@gmail.com", "swagapino22", "birdsRFake22")}>Register</button>
      <button onClick={() => signOutAuth()}>Sign Out</button>
      <button onClick={() => getCurrentUser()}>Current Signed-In User</button>
      <button onClick = {createUser}>Create </button>
      <button onClick = {retrieveUser}>Get </button>
      <button onClick = {removeUser}>Delete</button>
      <button onClick = {setUser}>Set</button>
      <button onClick = {addShiftToUser}>Assign Shift</button>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
      </main>
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
