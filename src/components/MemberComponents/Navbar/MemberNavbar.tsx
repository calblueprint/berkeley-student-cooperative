import * as React from "react";
import { useRouter } from "next/router";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import styles from "./MemberNavbar.module.css";
import Icon from "../../../assets/Icon";
import { useUserContext } from "../../../context/UserContext";

const MemberNavbar: React.FunctionComponent = () => {
  /**
   * Returns the navigation bar component for members
   *
   * no params
   * user is retrieved from the context using useUserContext()
   *
   */
  const router = useRouter();
  const { authUser, signOutAuth } = useUserContext();

  const userDetails = () => (
    // Renders user details - name and role
    <ListItem className={styles.item + " " + styles.userDetails}>
      <Icon type="navProfile" className={styles.icon} />
      <div>
        <Typography variant="subtitle1" color={"#FFFFFF"}>
          {authUser.firstName} {authUser.lastName}
        </Typography>
        <Typography variant="subtitle1" color={"#FFFFFF"}>
          {authUser.role}
        </Typography>
      </div>
    </ListItem>
  );

  const pages = () => (
    /**
     * Renders navigation bar buttons for 4 pages - dashboard, schedule, house, settings
     *
     * dashboard is the default page
     * onClick handler pushes "/member/[page name]" to the url using router
     */
    <List className={styles.pages}>
      <ListItem
        button
        key={"dashboard"}
        onClick={() => {
          router.push("/member/dashboard");
        }}
        className={
          router.pathname == "/member/dashboard" ? styles.active : styles.item
        }
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
    <div className={styles.logout}>
      <ListItem
        className={styles.item}
        button
        key={"settings"}
        onClick={() => {
          // signout MUST happen before pushing the login page, or else there is an error cuz the user context tries to use an empty user
          signOutAuth();
          router.push("/login");
        }}
      >
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
    </div>
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
