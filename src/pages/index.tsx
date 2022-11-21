import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout/Layout";
import SettingsInfo from "../components/MemberComponents/SettingsInfo/SettingsInfo";
import AvailabilityInfo from "../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import { addUser } from "../firebase/queries/user";
import { useUserContext } from "../context/UserContext";

const Home: NextPage = () => {
  const {
    authUser,
    house,
    register,
    signIn,
    signOutAuth,
    establishUserContext,
  } = useUserContext();
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
          <ShiftCard />
          <AssignShiftcard shiftID={"KGA1GPrcoFUqjVc6bUSh"} houseID={"EUC"} />
          <button
            onClick={() =>
              register(
                "cazwm@bsc.coop",
                "CAZ",
                "Manager",
                "Casa Zimbabwe",
                "Manager",
                "casamanager"
              )
            }
          >
            Register
          </button>
          <button
            onClick={() =>
              addUser(
                "eucwm@bsc.coop",
                "EUC",
                "Mananger",
                "Euclid",
                "Manager",
                "1777"
              )
            }
          >
            CREATE USER
          </button>
          <button onClick={() => signIn("eucwm@bsc.coop", "euclidmanager")}>
            SIGN IN
          </button>
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
