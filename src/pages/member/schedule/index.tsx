import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { MemberScheduleHeader } from "../../../components/MemberComponents/MemberSchedule/MemberScheduleHeader/MemberScheduleHeader";
import { MemberShiftSchedule } from "../../../components/MemberComponents/MemberSchedule/MemberShiftSchedule/MemberShiftSchedule";
import { useUserContext } from "../../../context/UserContext";
import  {useFirebaseAuth}  from "../../../firebase/queries/auth";
import { getUser } from "../../../firebase/queries/user";
import { House, User } from "../../../types/schema";
import styles from "./MemberSchedule.module.css";

type MemberSchedulePageProps = {
	user: User,
	house: House,
}

const MemberSchedulePage: React.FC<MemberSchedulePageProps> = ({
	user,
	house
}) => {
	const { authUser, signIn, signOutAuth } = useUserContext();
	console.log("AUTHUSER", authUser)

	return (
		<Layout>
			<MemberScheduleHeader/>
			<button onClick={() => signIn("test123@gmail.com", "test123")}> sign in</button>
			<h1>{authUser.first_name}</h1>
			<button onClick={() => signOutAuth()}> sign out</button>

			<MemberShiftSchedule member=""/>

		</Layout>
	)
}

export default MemberSchedulePage;