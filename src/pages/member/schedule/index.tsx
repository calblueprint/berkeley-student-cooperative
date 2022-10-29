import { Typography } from "@mui/material";
import React from "react";
import Layout from "../../../components/Layout/Layout";
import { MemberShiftView } from "../../../components/MemberShiftView/MemberShiftView";
import { House, User } from "../../../types/schema";
import styles from "./MemberSchedule.module.css";

type MemberSchedulePageProps = {
	user: User,
	house: House,
}

const MemberSchedulePage: React.FunctionComponent<MemberSchedulePageProps> = ({
	user,
	house
}) => {
	return (
		<Layout>
			<div className={styles.container}>
				<Typography variant="h2" className={styles.title}> My Schedule </Typography>
				<MemberShiftView member=""/>
			</div>
		</Layout>
	)
}

export default MemberSchedulePage;