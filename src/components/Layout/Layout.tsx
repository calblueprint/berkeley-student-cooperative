import React from "react";
import styles from "./Layout.module.css";
import MemberNavbar from "../MemberComponents/Navbar/MemberNavbar";
import Head from "next/head";
import ManagerNavbar from "../ManagerComponents/Navbar/ManagerNavbar";
import { useUserContext } from "../../context/UserContext";

const Layout = ({ children, title }: any) => {
	/**
	 * Layout component that formats each page to have the navbar alongisde all other components
	 *
	 * @param children - automatically passes in the children components that are within <Layout> wrapper
	 * @param title - title of page on web browser tab
	 * 
	 * @returns container for layout of page
	 */

  const { authUser } = useUserContext();

  return authUser.role == "Member" || authUser.role == "member" ? (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MemberNavbar />
      <div className={styles.page}>{children}</div>
    </div>
  ) : (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManagerNavbar />
      <div className={styles.page}>{children}</div>
    </div>
  );
};

export default Layout;
