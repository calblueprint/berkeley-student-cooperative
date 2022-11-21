import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import ShiftSchedule from "../components/ManagerComponents/shiftSchedule/ShiftSchedule";
import PlanningPage from "./manager/planningPage/PlanningPage";
import { mapToObject } from "../firebase/helpers";
import SettingsInfo from "../components/MemberComponents/SettingsInfo/SettingsInfo";
import AvailabilityInfo from "../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/user';
import { User } from "../types/schema";
import { useUserContext } from "../context/UserContext";
import {
  getAllHouses,
  getHouse,
  updateAddress,
} from "../firebase/queries/house";
import { House } from "../types/schema";

const Home: NextPage = () => {

	//getting all possible fields from auth; authUSER is current signed in user, house is the house object
	const { authUser, house, register, signIn, signOutAuth, establishUserContext } = useUserContext();

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
    deleteUser("SIH5XjDtdtNhiGb91Sq976Pl0Zc2");//naming conflicts of subfct is same name as overall fct
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
        <button onClick={() => signIn("dummy2@gmail.com", "birdsRFake22")}>SIGN IN</button>
        <button onClick={() => register("dummy2@gmail.com", "swagapino23", "birdsRFake22")}>Register</button>
        <button onClick={() => signOutAuth()}>Sign Out</button>
        <PlanningPage/>
        {/* <SettingsInfo userID={"1234"}/>
        <AvailabilityInfo userID={"1234"}/> */}
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

