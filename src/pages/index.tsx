import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import MemberListComponent from "./memberListComponent";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MemberListComponent houseID = "EUC"/>
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
