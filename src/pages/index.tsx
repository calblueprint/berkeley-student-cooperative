import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/userQueries';
import { User } from "../types/schema";
import { useAuth } from "../firebase/queries/auth";
import { defaultUser } from "../firebase/queries/user";
import { getAllHouses, getHouse, updateAddress} from "../firebase/queries/houseQueries";
import { House } from "../types/schema";
import ShiftSchedule from "../components/shiftSchedule/ShiftSchedule";
import { mapToObject } from "../firebase/helpers";


const Home: NextPage = () => {

	const { authUser, register, signIn, signOutAuth } = useAuth();

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

			<button onClick={() => signIn("dummy@gmail.com", "birdsRFake22")}>SIGN IN</button>
			<button onClick={() => signIn("test1@gmail.com", "test123")}>SIGN IN</button>

			<button onClick={() => register("dummy@gmail.com", "swagapino22", "birdsRFake22")}>Register</button>
			<button onClick={() => register("test4@gmail.com", "test user", "test123")}>Test User Register</button>

			<button onClick={() => signOutAuth()}>Sign Out</button>
			<button onClick={() => console.log(authUser)}> log user</button>
			<div>{authUser.name}</div>

			<button onClick = {createUser}>Create </button>
			<button onClick = {retrieveUser}>Get </button>
			<button onClick = {removeUser}>Delete</button>
			<button onClick = {setUser}>Set</button>
			<button onClick = {addShiftToUser}>Assign Shift</button>
      <ShiftSchedule></ShiftSchedule>
			<main className={styles.main}>xw
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

