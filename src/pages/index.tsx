import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addShift,
  updateShift,
  getShift,
  deleteShift,
} from "../firebase/queries/shiftQueries";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import ShiftCard from "../components/Shiftcard/Shiftcard";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTodos();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const todosCollection = collection(firestore, "todos");

  const getTodos = async () => {
    const todosQuery = query(
      todosCollection,
      where("done", "==", false),
      limit(10)
    );
    const querySnapshot = await getDocs(todosQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    setTodos(result);
  };

  const updateTodo = async (documentId: string) => {
    // create a pointer to the document id
    const _todo = doc(firestore, `todos/${documentId}`);

    // update the doc by setting done to true
    await updateDoc(_todo, {
      done: true,
    });

    // retrieve todos
    getTodos();
  };

  const deleteTodo = async (documentId: string) => {
    // create a pointer to the document id
    const _todo = doc(firestore, `todos/${documentId}`);

    // delete the doc
    await deleteDoc(_todo);

    // retrieve todos
    getTodos();
  };

  const removeShift = async () => {
    await deleteShift("W3ZDJ30oYDz3peCdSsUI");
  };

  const retrieveShift = async () => {
    let shift = await getShift("W3ZDJ30oYDz3peCdSsUI");
    console.log(shift?.usersAssigned);
  };

  const changeShift = async () => {
    let newData = {
      usersAssigned: ["user 1 id"],
    };
    await updateShift("W3ZDJ30oYDz3peCdSsUI", newData);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Workshift App</title>
        <meta name="description" content="Next.js firebase Workshift app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={removeShift}>Delete Shift</button>
      <button onClick={changeShift}>Update Shift</button>
      <button onClick={retrieveShift}>Get Shift</button>
      <main className={styles.main}>
        <h1 className={styles.title}>Workshift App</h1>
        <ShiftCard/>
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
