import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { getAllHouses, getHouse, updateAddress} from "../firebase/queries/houseQueries";
import { House } from "../types/schema";


const Home: NextPage = () => {
  const [houses, setHouses] = useState([] as House[]);
  const [currHouse, setCurrHouse] = useState({} as House);
  useEffect(() => {
    

  }, []);

  //gets all houses from firebase
  const getAllHouseFB = async () =>{
    var fireHouse = await getAllHouses();
    setHouses(fireHouse);
  }
  //gets specific house from firebase, must specify certain house
  const getHouseFB = async (houseID :string) =>{
    var fireAHouse = await getHouse(houseID);
    setCurrHouse(fireAHouse);
  }




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
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Workshift App
        </a>
      </footer>
    </div>
  );
};

export default Home;
