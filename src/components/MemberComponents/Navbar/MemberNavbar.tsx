import * as React from "react";
import { useRouter } from "next/router";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import styles from "./MemberNavbar.module.css";
import Icon from "../../../assets/Icon";
import Link from "next/link";

const MemberNavbar: React.FunctionComponent = () => {
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
          borderColor: "#E2E2E2",
        },
      }}
    >
      <List className={styles.list}>
        <Link href="/member">
          <ListItem
            button
            key={"dashboard"}
            // onClick={() => {
            //   router.push("/");
            // }}
            // className={styles.active}
            className={router.pathname == "/member" ? styles.active : styles.item}
          >
            <div className={styles.icon}>
              <Icon type="navDashboard" />
            </div>
            <ListItemText
              primaryTypographyProps={{ fontSize: "18px" }}
              className={styles.itemText}
              primary={"Dashboard"}
            />
          </ListItem>
        </Link>
        <Link href="/member/schedule">
          <ListItem
            button
            key={"schedule"}
            // onClick={() => {
            //   router.push("/schedule");
            // }}
            className={
              router.pathname == "/member/schedule"
                ? styles.active
                : styles.item
            }
          >
            <div className={styles.icon}>
              <Icon type="navSchedule" />
            </div>
            <ListItemText
              primaryTypographyProps={{ fontSize: "18px" }}
              className={styles.itemText}
              primary={"Schedule"}
            />
          </ListItem>
        </Link>

        <ListItem
          button
          key={"house"}
          onClick={() => {
            router.push("/member/house");
          }}
          className={
            router.pathname == "/member/house" ? styles.active : styles.item
          }
        >
          <div className={styles.icon}>
            <Icon type="navHouse" />
          </div>
          <ListItemText
            primaryTypographyProps={{ fontSize: "18px" }}
            className={styles.itemText}
            primary={"House"}
          />
        </ListItem>

        <ListItem
          button
          key={"settings"}
          onClick={() => {
            router.push("/member/settings");
          }}
          className={
            router.pathname == "/member/settings" ? styles.active : styles.item
          }
        >
          <div className={styles.icon}>
            <Icon type="navSettings" />
          </div>
          <ListItemText
            primaryTypographyProps={{ fontSize: "18px" }}
            className={styles.itemText}
            primary={"Settings"}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MemberNavbar;
