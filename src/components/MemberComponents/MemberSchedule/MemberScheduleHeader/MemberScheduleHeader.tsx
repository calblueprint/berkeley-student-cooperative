import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField, Button } from '@mui/material';
import styles from "./MemberScheduleHeader.module.css";
import Icon from "../../../../assets/Icon";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";


type MemberScheduleHeaderProps = {
	member?: string;
}

export const MemberScheduleHeader: React.FunctionComponent<MemberScheduleHeaderProps> = ({member}) => {



	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<Typography variant="h2" className = {styles.title}> Schedule </Typography>
			</div>
		</div>
	)
}