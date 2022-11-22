import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ShiftSchedule from "../components/ManagerComponents/shiftSchedule/ShiftSchedule";
import { useUserContext } from "../context/UserContext";

const Home: NextPage = () => {

	//getting all possible fields from auth; authUSER is current signed in user, house is the house object
	const { authUser, house, register, signIn, signOutAuth, establishUserContext } = useUserContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
        <button onClick={() => signIn("dummy2@gmail.com", "birdsRFake22")}>SIGN IN</button>
        <button onClick={() => register("dummy2@gmail.com", "swagapino23", "birdsRFake22")}>Register</button>
        <button onClick={() => signOutAuth()}>Sign Out</button>
        <ShiftSchedule/>
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

