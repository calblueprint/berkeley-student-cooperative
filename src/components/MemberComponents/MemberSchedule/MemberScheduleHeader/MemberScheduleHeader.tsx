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

	const searchBar = () => (
		<div className={styles.searchBar}>
			<TextField 
			  id = "outlined-basic" 
				label="Search" 
				variant="outlined"
				sx={{
					width: "100%",
					backgroundColor: "#FFFFFFFF"
				}}
				/>
		</div>
	)

	return (
		<div className={styles.container}>
			<Typography variant="h2" className={styles.title}> Schedule </Typography>
		</div>
	)
}