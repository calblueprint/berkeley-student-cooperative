import type { NextPage } from "next";
import Head from "next/head";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getHouses } from "../firebase/queries/exampleQuery";
import { getCurrentUser, register, signIn, signOutAuth} from '../firebase/queries/auth'
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/userQueries';

const Home: NextPage = () => {

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
        <ShiftCard />
        <AssignShiftcard shiftID={"KGA1GPrcoFUqjVc6bUSh"} houseID={"EUC"} />
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
