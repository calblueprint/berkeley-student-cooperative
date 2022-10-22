import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ShiftAssignmentComponentCard from "./shiftAssignmentComponentCard";

const Home: NextPage = () => {
  const shiftID = "dvIP6CZVL6CCYLVB0VPg";
  const houseID = "euclid"; //capitalization
  const day = "Monday";
  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
      </main>
      <ShiftAssignmentComponentCard day = {day} houseID = {houseID} shiftID = { shiftID }/>
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
