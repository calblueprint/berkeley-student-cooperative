import React, { useCallback, useEffect, useState } from "react";
import styles from "./Layout.module.css";
import MemberNavbar from "../MemberComponents/Navbar/MemberNavbar";
import Head from "next/head";
import ManagerNavbar from "../ManagerComponents/Navbar/ManagerNavbar";
import { useUserContext } from "../../context/UserContext";

const Layout = ({ children, title }: any) => {
  const { authUser } = useUserContext();

  return authUser.role == "Manager" || authUser.role == "manager" ? (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManagerNavbar />
      <div className={styles.page}>{children}</div>
    </div>
  ) : (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MemberNavbar />
      <div className={styles.page}>{children}</div>
    </div>
  );
};

export default Layout;
