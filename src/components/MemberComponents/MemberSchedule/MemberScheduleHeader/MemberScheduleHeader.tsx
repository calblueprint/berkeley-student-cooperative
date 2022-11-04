import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField } from '@mui/material';
import styles from "./MemberScheduleHeader.module.css";
import Icon from "../../../../assets/Icon";


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
					width: "45.2%",
					backgroundColor: "#FFFFFFFF"
				}}
				/>
		</div>
	)

	return (
		<div className={styles.container}>
			<Typography variant="h2"> Schedule </Typography>
		</div>
	)
}