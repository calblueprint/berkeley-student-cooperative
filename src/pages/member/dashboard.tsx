import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Layout from "../../components/Layout/Layout";
import CreateAccountPage from "../createAccountPage";
const Home: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Members Dashboard</title>
        </Head>
        
        <main className={styles.main}>
          <h1 className={styles.title}>Members Dashboard</h1>
          <CreateAccountPage></CreateAccountPage>
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
