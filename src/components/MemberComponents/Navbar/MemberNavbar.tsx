import * as React from "react";
import { useRouter } from "next/router";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import styles from "./MemberNavbar.module.css";
import Icon from "../../../assets/Icon";

const MemberNavbar: React.FunctionComponent = () => {
  const router = useRouter();

  const userDetails = () => (
    <ListItem className={styles.item + " " + styles.userDetails}>
      <Icon type="navProfile" className={styles.icon} />
      <div>
        <Typography variant="subtitle1" color={"#FFFFFF"}>
          Evan Quan
        </Typography>
        <Typography variant="subtitle1" color={"#FFFFFF"}>
          Shift Member
        </Typography>
      </div>
    </ListItem>
  );

  const pages = () => (
    <List className={styles.pages}>
      <ListItem
        button
        key={"dashboard"}
        onClick={() => {
          router.push("/member");
        }}
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
      <ListItem
        button
        key={"schedule"}
        onClick={() => {
          router.push("/member/schedule");
        }}
        className={
          router.pathname == "/member/schedule" ? styles.active : styles.item
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
  );

  const logout = () => (
    <List className={styles.logout}>
      <ListItem className={styles.item}>
        <Icon type="navLogout" />
        <ListItemText
          primaryTypographyProps={{
            fontSize: "18px",
            color: "#FFFFFF",
            fontWeight: 600,
          }}
          className={styles.itemText}
          primary={"Logout"}
        />
      </ListItem>
    </List>
  );

  return (
    <div className={styles.container}>
      {userDetails()}
      {pages()}
      {logout()}
    </div>
  );
};

export default MemberNavbar;
