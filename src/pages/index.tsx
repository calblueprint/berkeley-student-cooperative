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
} from "../firebase/queries/house";
import { House } from "../types/schema";
import Layout from "../components/Layout/Layout";
import { MemberShiftSchedule } from "../components/MemberComponents/MemberSchedule/MemberShiftSchedule/MemberShiftSchedule";

const Home: NextPage = () => {
  return (
		//title is the name that will show on the browser tab
		//wrap each page in this layout tag
		<Layout>
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
		</Layout>
  );
};

export default Home;
