import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField } from '@mui/material';
import styles from "./MemberShiftSchedule.module.css";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";
import { MemberScheduleHeader } from "../MemberScheduleHeader/MemberScheduleHeader";
import {DataGrid, GridColDef, GridColumns, GridValueGetterParams } from '@mui/x-data-grid';


type MemberShiftScheduleProps = {
	user: User;
}

export const MemberShiftSchedule: React.FunctionComponent<MemberShiftScheduleProps> = ({user}) => {

	const columns: GridColDef[] = [
		{field: 'shiftName', headerName: 'SHIFT NAME', width: 600},
		{field: 'value', headerName: 'VALUE', width: 100},
		{field: 'time', headerName: 'TIME', width: 200},
		{field: 'status', headerName: 'STATUS', width: 200},
	]

	
	//fetch all shifts for the member
	//loop through and add the row to rows
	const rows = [
		{  id: 1, shiftName: "make breakfast", value: "1 hour" , time: "10AM - 11AM", status: "Missing" },
		{  id: 2, shiftName: "make breakfast", value: "1 hour", time: "9AM - 11AM", status:  "Incomplete"},
		{  id: 3, shiftName: "make breakfast", value: "1 hour" , time: "10AM - 11AM", status: "Missing" },
		{  id: 4, shiftName: "make breakfast", value: "2 hour", time: "10AM - 11AM", status:  "Incomplete"},
		{  id: 5, shiftName: "make breakfast", value: "1 hour" , time: "10AM - 12AM", status: "Missing" },
		{  id: 6, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 7, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 8, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 9, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 10, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 11, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},
		{  id: 12, shiftName: "make breakfast", value: "0 hour", time: "10AM - 11AM", status:  "Complete"},

	]

	return (
		  <div className={styles.container}>
				<DataGrid
					rows = {rows}
					columns = {columns}
					className = {styles.schedule}
				/>
			</div>
	)
}