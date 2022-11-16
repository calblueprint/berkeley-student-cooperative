import React from "react";
import styles from "./Layout.module.css";
import MemberNavbar from "../MemberComponents/MemberNavbar/MemberNavbar";
import Head from "next/head";

interface Props {
	title?: string,
	children: React.ReactNode[] | React.ReactNode
}

const Layout: React.FunctionComponent<Props> = (props: Props) => {

	//authUser and loading to auto direct to login?
	
	return (
		<div className={styles.container}>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

			<MemberNavbar />	
			<div className={styles.page}>
				{props.children}
			</div>	
					
		</div>
	)
}

export default Layout;
