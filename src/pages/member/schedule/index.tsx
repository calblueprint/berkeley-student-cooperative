import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import { MemberScheduleHeader } from "../../../components/MemberComponents/MemberSchedule/MemberScheduleHeader/MemberScheduleHeader";
import { MemberShiftFilters } from "../../../components/MemberComponents/MemberSchedule/MemberShiftFilters/MemberShiftFilters";
import { MemberShiftSchedule } from "../../../components/MemberComponents/MemberSchedule/MemberShiftSchedule/MemberShiftSchedule";
import { useUserContext } from "../../../context/UserContext";
import  {useFirebaseAuth}  from "../../../firebase/queries/auth";
import { getUser } from "../../../firebase/queries/user";
import { House, User } from "../../../types/schema";
import styles from "./MemberSchedule.module.css";

type MemberSchedulePageProps = {
	user?: User,
	house?: House,
}

const MemberSchedulePage: React.FC<MemberSchedulePageProps> = ({
	user,
	house
}) => {
	const { authUser, signIn, signOutAuth, register } = useUserContext();
	console.log("AUTHUSER", authUser)

	return (
		<Layout>
			<MemberScheduleHeader/>
			<div className={styles.center}>
				<MemberShiftFilters />
			</div>
			<div className={styles.table}>
				<MemberShiftSchedule user = {authUser}/>
			</div>
		</Layout>
	)
}

export default MemberSchedulePage;