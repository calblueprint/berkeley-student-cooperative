import type { NextPage } from "next";
import Head from "next/head";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  getAllHouses,
  getHouse,
  updateAddress,
  addCategory,
  removeCategory,
  getCategories,
} from "../firebase/queries/house";

import { House } from "../types/schema";

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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