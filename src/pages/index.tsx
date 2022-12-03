import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/user';
import { User } from "../types/schema";
import { useUserContext } from "../context/UserContext";
import {
  getAllHouses,
  getHouse,
  updateAddress,
} from "../firebase/queries/house";
import { House } from "../types/schema";
import SettingsInfo from "../components/MemberComponents/SettingsInfo/SettingsInfo";
import AvailabilityInfo from "../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import ViewShiftcard from "../components/MemberComponents/ViewShiftcard/ViewShiftcard";
import { firestoreAutoId } from "../firebase/helpers";

const Home: NextPage = () => {
 
	//getting all possible fields from auth; authUSER is current signed in user, house is the house object
	const { authUser, house, register, signIn, signOutAuth} = useUserContext();

  const createUser = async () => {
    addUser("bsc@berkeley.edu", "EUC", "Sean", "Seanson", "Manager", firestoreAutoId());
  }

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
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
        {/* <button onClick={() => signIn("viewCardTester@gmail.com", "iluvtesting")}>SIGN IN</button> */}
        <button onClick={() => signIn("viewCardTester2@gmail.com", "iluvtestingtoo")}>SIGN IN</button>
        {/* <button onClick = {() => register("viewCardTester2@gmail.com", "testluvr2", "iluvtestingtoo")}>Register</button> */}
        <ShiftCard />
        <SettingsInfo userID={"1234"}/>
        <AvailabilityInfo userID={"1234"}/>
        <ViewShiftcard shiftID={"iBVA4gOntEGFA4AxpqFU"} houseID={"EUC"}/>
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

