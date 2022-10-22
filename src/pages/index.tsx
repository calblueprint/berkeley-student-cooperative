import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  getAllHouses,
  getHouse,
  updateAddress,
} from "../firebase/queries/house";
import { House } from "../types/schema";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
		//title is the name that will show on the browser tab
		//wrap each page in this layout tag
		<Layout title = "BSC">
			<div className={styles.container}>
				<Head>
					<title>Workshift App</title>
					<meta name="description" content="Next.js firebase Workshift app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main className={styles.main}>
					<h1 className={styles.title}>Workshift App</h1>
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
