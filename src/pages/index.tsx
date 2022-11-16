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
import { mapToObject } from "../firebase/helpers";
import { addShift } from "../firebase/queries/shift";
const Home: NextPage = () => {

  let houseID = "EUC";
  let cleanDownstairsBasement1 = "HEK5HlHqssGORikn4v0N";
  let cookLunchMonday = "zGIjtcRhVF1tmQuVzEEY";
  let cleanDownstairsBasement2 = "Z0x4x9P4rRVmDpqVQAci";
  let cookLunchWednesday = "T4BT4aX2omS9zTHyGljj";
  let headCookDinner = "Lv56ofll5jG23hBVGMxm";
  let mopKitchenFloor = "DrqlMb9jA7Uq5wW7nNNK";
  let cleanRooftop = "ufOtIX6qEtZ7FjrKosOb";
  let vacuumKitchen = "pevk4J49ZidrWghR8pwG";
  let quickShift = "lz6VwCFzi6rLxnI9CSdo";
  let miscHalfHourShift = "7eaxlxK9sKtfVZ6Ddn6U";
  let allShifts = [cleanDownstairsBasement1, cleanDownstairsBasement2, cookLunchMonday, cookLunchWednesday, headCookDinner, mopKitchenFloor, cleanRooftop, vacuumKitchen, quickShift, miscHalfHourShift];
	function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const create10Users = async () => {
    for (let i = 1; i < 11; i++) {
      let email = i + "@gmail.com";
      let id = i + "";
      await addUser(email, houseID, id, "member", id);
    }
    for (let i = 1; i < 11; i++) {
      let id = i + "";
      let availabilities = new Map<string, number[]>();
      let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      for (let j = 0; j < days.length; j++) {
        availabilities.set(days[j], [0, 300, 300, 600, 900, 1200, 1200, 1500]);
      }
      let newData = {
        availabilities: mapToObject(availabilities)
      }
      await updateUser(id, newData);
    }
  }

  const preference10Users = async () => {
    for (let userID = 1; userID < 11; userID++) {
      let preferences = new Map<string, number>();
      for (let shiftIndex = 0; shiftIndex < allShifts.length; shiftIndex++) {
        let shift = allShifts[shiftIndex];
        let rating = randomInteger(0, 2);
        preferences.set(shift, rating);
      }
      let newData = {
        preferences: mapToObject(preferences)
      }
      await updateUser(userID + "", newData);
    }
  }

  const createShift = async () => {
    await addShift(houseID, "Misc Half Hour Shift", "idk description lmao", 5, ["Tuesday"], [900, 930], "", 0.5, true, 48, "Misc");
    await addShift(houseID, "QuickShift", "idk description lmao", 10, ["Sunday"], [0, 200], "", 2, true, 4, "Misc");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick = {create10Users}>Create 10 users</button>
      <button onClick = {preference10Users}>Create shift</button>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
        <ShiftCard />
        <AssignShiftcard shiftID={"iBVA4gOntEGFA4AxpqFU"} houseID={"EUC"} />
        <SettingsInfo userID={"1234"}/>
        <AvailabilityInfo userID={"1234"}/>
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

