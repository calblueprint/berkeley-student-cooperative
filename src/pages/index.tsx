import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout/Layout";
import SettingsInfo from "../components/MemberComponents/SettingsInfo/SettingsInfo";
import AvailabilityInfo from "../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import router from "next/router";
import { addUser } from "../firebase/queries/user";
import { useUserContext } from "../context/UserContext";
import ShiftSchedule from "../components/ManagerComponents/shiftSchedule/ShiftSchedule";

const Home: NextPage = () => {

  const { authUser, house, register, signIn, signOutAuth, establishUserContext } = useUserContext();
  console.log({authUser: authUser});
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Workshift App</title>
          <meta name="description" content="Next.js firebase Workshift app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Workshift App</h1>
          <button onClick={() => register("pinTest78@gmail.com", "EUC", "Tester2", "Pin", "member", "wowTesting")}>Register</button>
          <button onClick={() => signIn("pinTest78@gmail.com", "wowTesting")}>Sign In</button>
          <ShiftCard />
          <button
            onClick={() => {
              router.push("/ParseCsv/ParseCsv");
            }}
          >
            Parse
          </button>
          <button onClick={() => register("testing_register@gmail.com", "EUC", "Greg", "M", "Member", "testing123")}>Register</button>
					<button onClick={() => signIn("test123@gmail.com", "test123")}>Sign In</button>
					<button onClick={() => signOutAuth()}>Sign Out</button>
					<h1>{authUser ? authUser.first_name + " " + authUser.last_name : "not signed in"}</h1>
          <ShiftSchedule/>
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
function firestoreAutoId(): string {
  throw new Error("Function not implemented.");
}
