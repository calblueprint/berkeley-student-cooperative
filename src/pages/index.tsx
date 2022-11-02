import type { NextPage } from "next";
import Head from "next/head";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import {
  getCurrentUser,
  register,
  signIn,
  signOutAuth,
} from "../firebase/queries/auth";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  getAllHouses,
  getHouse,
  updateAddress,
} from "../firebase/queries/house";
import { House } from "../types/schema";
import SettingsInfo from "../components/MemberComponents/SettingsInfo/SettingsInfo";
import AvailabilityInfo from "../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => register("test@email.com", "Test Email", "test")}>
        Register
      </button>
      <button onClick={() => signIn("test@email.com", "test")}>SIGN IN</button>
      <button onClick={() => signOutAuth()}>Sign Out</button>
      <button onClick={() => getCurrentUser()}>Current Signed-In User</button>
      <ShiftCard />
      <AssignShiftcard shiftID={"KGA1GPrcoFUqjVc6bUSh"} houseID={"EUC"} />
      <SettingsInfo userID={"1234"} />
      <AvailabilityInfo userID={"1234"} />
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
