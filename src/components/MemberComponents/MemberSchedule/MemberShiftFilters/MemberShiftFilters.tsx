import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField, FormControl, InputLabel, MenuItem, Select, InputAdornment } from '@mui/material';
import styles from "./MemberShiftFilters.module.css";
import Icon from "../../../../assets/Icon";


type MemberShiftFiltersProps = {
	member?: string;
}

export const MemberShiftFilters: React.FunctionComponent<MemberShiftFiltersProps> = ({member}) => {

	const searchBar = () => (
		<div className={styles.searchBar}>
			<TextField 
			  id = "outlined-basic" 
				label="Search" 
				variant="outlined"
				sx={{
					width: "100%",
					backgroundColor: "#FFFFFFFF",
				}}
				InputProps={{
					endAdornment: <InputAdornment position="start"><Icon type="search"/></InputAdornment>,
				}}
				/>
		</div>
	)

	const filterButtons = () => (
		<div className={styles.filters}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Alphabetical</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					// value={age}
					label="Alphabetical"
					// onChange={handleChange}
					sx={{
						backgroundColor: "#FFFFFFFF"
					}}
				>
					<MenuItem value={"add values"}>A</MenuItem>
					<MenuItem>B</MenuItem>
					<MenuItem>C</MenuItem>
					<MenuItem>sort? already in table...</MenuItem>

				</Select>
			</FormControl>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Day</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					// value={age}
					label="Age"
					// onChange={handleChange}
					sx={{
						backgroundColor: "#FFFFFFFF"
					}}
				>
					<MenuItem>Sunday</MenuItem>
					<MenuItem>Monday</MenuItem>
					<MenuItem>Tuesday</MenuItem>
					<MenuItem>Wednesday</MenuItem>
					<MenuItem>Thursday</MenuItem>
					<MenuItem>Friday</MenuItem>
					<MenuItem>Saturday</MenuItem>
				</Select>
			</FormControl>
		</div>
	)

	return (
		<div className={styles.container}>
			{searchBar()}
			{/* {filterButtons()} */}
		</div>
	)
}