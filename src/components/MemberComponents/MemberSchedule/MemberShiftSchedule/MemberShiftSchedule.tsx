import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField } from '@mui/material';
import styles from "./MemberShiftSchedule.module.css";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";
import { MemberScheduleHeader } from "../MemberScheduleHeader/MemberScheduleHeader";

type MemberShiftScheduleProps = {
	member: string;
}

export const MemberShiftSchedule: React.FunctionComponent<MemberShiftScheduleProps> = ({member}) => {

		

	return (
		  <div className={styles.container}>
			</div>
	)
}