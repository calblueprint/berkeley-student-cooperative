import type { NextPage } from "next";
import Head from "next/head";
import { firestore } from "../firebase/clientApp";
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
} from "@firebase/firestore";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import {addUser, getUser, deleteUser} from "../firebase/firestore/userQueries";

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

  const createUser = async () => {
    addUser("bsc@berkeley.edu", "Euclid", "Sean", 12345, "Manager");
  }

  const retrieveUser = async () => {
    getUser("oBP9JM09iDIPufWeQJQ1");
  }

  const removeUser = async () => {
    deleteUser("oBP9JM09iDIPufWeQJQ1");//naming conflicts of subfct is same name as overall fct
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Todos app</title>
        <meta name="description" content="Next.js firebase todos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick = {createUser}>Create </button>
      <button onClick = {retrieveUser}>Get </button>
      <button onClick = {removeUser}>Delete</button>
      <main className={styles.main}>
        <h1 className={styles.title}>Todos app</h1>

        <div className={styles.grid}>
          {loading ? (
            <div className={styles.card}>
              <h2>Loading</h2>
            </div>
          ) : todos.length === 0 ? (
            <div className={styles.card}>
              <h2>No undone todos</h2>
              <p>
                Consider adding a todo from <Link href="/add-todo">here</Link>
              </p>
            </div>
          ) : (
            todos.map((todo, index) => {
              return (
                <div className={styles.card} key={index}>
                  <h2>{todo.data().title}</h2>
                  <p>{todo.data().description}</p>

                  <div className={styles.cardActions}>
                    <button type="button" onClick={() => updateTodo(todo.id)}>
                      Mark as done
                    </button>

                    <button type="button" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Todos app
        </a>
      </footer>
    </div>
  );
};

export default Home;
