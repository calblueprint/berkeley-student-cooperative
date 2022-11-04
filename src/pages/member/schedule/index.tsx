import { Typography } from "@mui/material";
import React from "react";
import Layout from "../../../components/Layout/Layout";
import { MemberScheduleHeader } from "../../../components/MemberComponents/MemberSchedule/MemberScheduleHeader/MemberScheduleHeader";
import { MemberShiftSchedule } from "../../../components/MemberComponents/MemberSchedule/MemberShiftSchedule/MemberShiftSchedule";
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
	return (
		<Layout>
			<MemberScheduleHeader/>
			<MemberShiftSchedule member=""/>
		</Layout>
	)
}

export default MemberSchedulePage;