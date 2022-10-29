import type { NextPage } from "next";
import Head from "next/head";
import ShiftCard from "../components/ManagerComponents/Shiftcard/Shiftcard";
import AssignShiftcard from "../components/ManagerComponents/AssignShiftcard/AssignShiftcard";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import {
  getAllHouses,
  getHouse,
  updateAddress,
} from "../firebase/queries/house";
import { House } from "../types/schema";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return <Layout></Layout>;
};

export default Home;
