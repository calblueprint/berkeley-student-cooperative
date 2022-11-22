import React, { useCallback, useEffect, useState } from "react";
import styles from "./Layout.module.css";
import MemberNavbar from "../MemberComponents/Navbar/MemberNavbar";
import Head from "next/head";
import ManagerNavbar from "../ManagerComponents/Navbar/ManagerNavbar";
import { useRouter } from "next/router";

const Layout = ({ children, title }: any) => {
  const router = useRouter();
  const [role, setRole] = useState("member");

  const memoizedRouterChange = useCallback(() => {
    if (role == "member") {
      router.push("/member");
    }
  }, [role, router]);

  useEffect(() => {
    memoizedRouterChange;
  }, [memoizedRouterChange]);

  const updateURL = () => {
    if (role == "member") {
      router.push("/member");
    }
  };

  //authUser and loading to auto direct to login?

  return role == "member" || role == "Member" ? ( // TODO: fix how we set the roles to be consistent with one of these
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
