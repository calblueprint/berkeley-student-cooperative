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
import { getHouses } from "../firebase/queries/exampleQuery";
import { register, signIn, signOutAuth} from '../firebase/queries/auth'
import {addUser, deleteUser, updateUser, getUser, assignShiftToUser} from '../firebase/queries/userQueries';

const Home: NextPage = () => {
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTodos();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //Naive Version, similar func should be used l8r.
  //Used for testing Auth rn.  Keep for l8r
  const handleSignin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (e) {
      console.error("Incorrect email or password");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      alert("REGISTERED");
      await signIn(email, password);
      alert("REGISTERED");
    } catch (e) {
      console.error("Invalid email or password");
    }
  };


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
    addUser("bsc@berkeley.edu", "Euclid", "Sean", "Manager", firestoreAutoId());
  }

  const firestoreAutoId = (): string => {
    const CHARS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";
    for (let i = 0; i < 20; i += 1) {
      autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
  };
  


  const retrieveUser = async () => {
    let x = await getUser("mc8XQK7aiZW1dg8IC8v5");
    if (x != null) {
      console.log(x.availabilities);
      console.log(x.shiftsAssigned);
    }
  }

  const removeUser = async () => {
    deleteUser("mc8XQK7aiZW1dg8IC8v5");//naming conflicts of subfct is same name as overall fct
  }
  
  const setUser = async () => {
    let availabilities = new Map<string, Array<number>>();
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (let i = 0; i < days.length; i++) {
      let newList = new Array<number>();
      newList.push(0);
      newList.push(2330);
      availabilities.set(days[i], newList);
    }
    let newData = {
      availabilities: mapToObject(availabilities)
    }
    updateUser("mc8XQK7aiZW1dg8IC8v5", newData);
  }

  const addShiftToUser = async () => {
    await assignShiftToUser("mc8XQK7aiZW1dg8IC8v5", "1");
    await retrieveUser();
  }


  const mapToObject = (map: Map<any, any>): Object => {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        v instanceof Map ? [k, mapToObject(v)] : [k, v]
      )
    );
  };

  const objectToMap = (obj: Object): Map<any, any> => {
    return new Map(
        Array.from(Object.entries(obj), ([k, v]) =>
        v instanceof Object ? [k, objectToMap(v)] : [k, v]
        )
    );
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Todos app</title>
        <meta name="description" content="Next.js firebase todos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={() => signIn("dummy@gmail.com", "birdsRFake22")}>SIGN IN</button>
      <button onClick={() => register("dummy@gmail.com", "swagapino22", "birdsRFake22")}>Register</button>
      <button onClick={() => signOutAuth()}>Sign Out</button>
      <button onClick = {createUser}>Create </button>
      <button onClick = {retrieveUser}>Get </button>
      <button onClick = {removeUser}>Delete</button>
      <button onClick = {setUser}>Set</button>
      <button onClick = {addShiftToUser}>Assign Shift</button>
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
