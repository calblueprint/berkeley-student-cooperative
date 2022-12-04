import * as React from "react";
import { useRouter } from "next/router";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material"
import styles from "./MemberNavbar.module.css"
import Icon from "../../../assets/Icon";
import { useUserContext } from "../../../context/UserContext";

const MemberNavbar: React.FunctionComponent = () => {
	const router = useRouter();

	const { signOutAuth } = useUserContext();

	const userDetails = () => (
		<ListItem className={styles.item + " " + styles.userDetails}>
			<Icon type="navDashboard" className={styles.icon} />
			<div>
				<Typography variant = "subtitle1" color={"#FFFFFF"} >
					Evan Quan
				</Typography>
				<Typography variant = "subtitle1" color={"#FFFFFF"}>
					Shift Member
				</Typography>
			</div>
		</ListItem>
	)

	const pages = () => (
		<List className={styles.pages}>
				<ListItem
					button
					key={"dashboard"}
          onClick={() => {
            router.push("/member/dashboard");
          }}
					className={router.pathname == "/member/dashboard" ? styles.active : styles.item}
					>
            <Icon type="navDashboard" />
						<ListItemText
							primaryTypographyProps={{fontSize: '18px'}}
						  className={styles.itemText}
							primary={"Dashboard"}
						/>
				</ListItem>

				<ListItem
					button
					key={"schedule"}
          onClick={() => {
            router.push("/member/schedule");
          }}
					className={router.pathname == "/member/schedule" ? styles.active : styles.item}
					>
            <Icon type="navDashboard" />
						<ListItemText
							primaryTypographyProps={{fontSize: '18px'}}
						  className={styles.itemText}
							primary={"Schedule"}
						/>
				</ListItem>

				<ListItem
					button
					key={"house"}
          onClick={() => {
            router.push("/member/house");
          }}
					className={router.pathname == "/member/house" ? styles.active : styles.item}
					>
            <Icon type="navDashboard" />
						<ListItemText
							primaryTypographyProps={{fontSize: '18px'}}
						  className={styles.itemText}
							primary={"House"}
						/>
				</ListItem>

				<ListItem
					button
					key={"settings"}
          onClick={() => {
            router.push("/settings");
          }}
          className={router.pathname == "/settings" ? styles.active : styles.item}			
					>
            <Icon type="navDashboard" />
						<ListItemText
							primaryTypographyProps={{fontSize: '18px'}}
						  className={styles.itemText}
							primary={"Settings"}
						/>
				</ListItem>
			</List>
	)

	const logout = () => (
		<List className={styles.logout}>
			<ListItem className={styles.item} onClick = {() => signOutAuth()}>
				<Icon type="navDashboard" />
				<ListItemText
						primaryTypographyProps={{fontSize: '18px', color: '#FFFFFF', fontWeight: 600}}
						className={styles.itemText}
						primary={"Logout"}
						/>
			</ListItem>
		</List>
	)

	return (
		<div className={styles.container}>
			{userDetails()}
			{pages()}
			{logout()}			
		</div>
	)
}

export default MemberNavbar;