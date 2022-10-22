import * as React from "react";
import { useRouter } from "next/router";
import { Drawer, List, ListItem, ListItemText } from "@mui/material"
import styles from "./Navbar.module.css"
import Icon from "../../../assets/Icon";

const Navbar: React.FunctionComponent = () => {
	const router = useRouter();

	return (
		<Drawer
			anchor="left"
			variant="permanent"
			sx={{
				display: {
					width: "110px",
					flexShrink: "0",
				},
				"& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: "169px",
					marginTop: "15%",
          backgroundColor: "#FFFFFF",
          border: "solid",
          color: "white",
					borderWidth: "1px",
					borderColor: "#E2E2E2"
        },
			}}
		>
			<List className={styles.list}>
				<ListItem
					button
					key={"dashboard"}
          onClick={() => {
            router.push("/dashboard");
          }}
					className={styles.active}
          // className={router.pathname == "/dashboard" ? styles.active : styles.item}			
					>
						<div className={styles.icon}>
            	<Icon type="navDashboard" />
						</div>
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
            router.push("/schedule");
          }}
          className={router.pathname == "/schedule" ? styles.active : styles.item}			
					>
						<div className={styles.icon}>
            	<Icon type="navDashboard" />
						</div>
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
            router.push("/house");
          }}
          className={router.pathname == "/house" ? styles.active : styles.item}			
					>
						<div className={styles.icon}>
            	<Icon type="navDashboard" />
						</div>						
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
						<div className={styles.icon}>
            	<Icon type="navDashboard" />
						</div>						
						<ListItemText
							primaryTypographyProps={{fontSize: '18px'}}
						  className={styles.itemText}
							primary={"Settings"}
						/>
				</ListItem>
			</List>
		</Drawer>
	)
}

export default Navbar;