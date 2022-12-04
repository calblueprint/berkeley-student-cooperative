import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Dashboard.module.css";
import Layout from "../../../components/Layout/Layout";
import AvailabilityInputModal from "../../../components/MemberComponents/AvailabilityEntry/AvailabilityInputModal";
import { useUserContext } from "../../../context/UserContext";
import CategoriesView from "../../manager/categoryDropdown/categoriesView";

const Home: NextPage = () => {

  const {authUser} = useUserContext();

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Members Dashboard</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Members Dashboard</h1>
        </main>
        <CategoriesView houseID = "EUC"/>
        {/* <AvailabilityInputModal userID={authUser.userID}></AvailabilityInputModal> */}
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
