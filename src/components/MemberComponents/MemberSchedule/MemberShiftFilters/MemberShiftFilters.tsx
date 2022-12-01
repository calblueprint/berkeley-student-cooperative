import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField } from '@mui/material';
import styles from "./MemberShiftFilters.module.css";
import Icon from "../../../../assets/Icon";
import { getShiftsByUser } from "../../../../firebase/queries/shift";


type MemberShiftFiltersProps = {
	member?: string;
}

export const MemberShiftFilters: React.FunctionComponent<MemberShiftFiltersProps> = ({member}) => {

	// const verifyCards = () => (
	// 	<div className={styles.cards}>
	// 		<div className={styles.card}>
	// 				<Typography variant="h4">4</Typography>
	// 				<Typography variant="body1">shifts to verify today</Typography>
	// 			</div>
	// 			<div className={styles.card}>
	// 				<Typography variant="h4">3</Typography>
	// 				<Typography variant="body1">hours of shifts to verify today</Typography>			
	// 			</div>
	// 	</div>
	// );

	//MOVE TO FILTER COMPONENT WITH ALPH DAY DATE
	// const dateCard = () => {
	// 	<div className={styles.dateCard}>
	// 		<Icon type="leftArrow" className="leftArrow" />
	// 		{/* TODO GET SUNDAY - SUNDAY */}
	// 		<Typography variant="subtitle1">Oct 16</Typography>
	// 		<Icon type="rightArrow" className="rightArrow" />
	// 	</div>
	// }
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

	const filterButtons = () => (
		<div className={styles.filters}>
			<button onClick={() => getShiftsByUser("1234", "EUC")}>alphabetical</button>
			<button>monday</button>
			<button>temp shift</button>
		</div>
	)


	// <div className={styles.toolBar}>
	// 			<MemberShiftFilters />
	// 			<div className={styles.filters}>

	// 			</div>
	// 		</div>
	return (
		<div className={styles.container}>
			<>{searchBar()}</>
			<>{filterButtons()}</>
		</div>
	)
}