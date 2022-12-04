import React, {useState, useEffect} from "react";
import { User, Shift } from "../../../../types/schema";
import { Typography, Card, TextField, InputAdornment } from '@mui/material';
import styles from "./MemberShiftSchedule.module.css";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";
import { MemberScheduleHeader } from "../MemberScheduleHeader/MemberScheduleHeader";
import {DataGrid, GridColDef, GridColumns, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { getShift } from "../../../../firebase/queries/shift";
import useWindowDimensions from "../../../../helpers/helpers";
import { parseTime } from "../../../../firebase/helpers";
import Icon  from "../../../../assets/Icon"


type MemberShiftScheduleProps = {
	user: User;
}

type column = {
	id: string,
	shiftName: string,
	time: string,
	value: string,
	status: string,
}


export const MemberShiftSchedule: React.FunctionComponent<MemberShiftScheduleProps> = ({user}) => {
	
	const [rows, setRows] = useState<column[]>([])
	const { height, width } = useWindowDimensions();
	const [tableWidth, setTableWidth] = useState((width - 197) * 0.92)

	useEffect(() => {
		//UPDATE THIS LOGIC TO ADJUST TABLE WIDTH 
		// W/OUT USEEFFECT MAKING WINDOW UPDATE SLOWER WHEN WIDTH CHANGES
		setTableWidth((width - 197) * 0.92);
	}, [width])

	useEffect(() => {
		const fetchRows = async () => {
			const rows = await getRows()
			setRows(rows)
		}
		fetchRows()
	}, [])

	const renderStatus = (cellValues: any) => {
		return (
			<div className={styles.status}>
				{
					cellValues.row.day[0] == "S"
						? <div className={styles.complete}>
								Complete
							</div>
						: <div className={styles.incomplete}>
								Incomplete
							</div>
				}
			</div>
		)
	}

	const columns: GridColDef[] = [
		{field: 'shiftName', headerName: 'SHIFT NAME', width: tableWidth * 0.3},
		{field: 'day', headerName: 'DAY', width: tableWidth * 0.17},
		{field: 'time', headerName: 'TIME', width: tableWidth * 0.17},
		{field: 'value', headerName: 'VALUE', width: tableWidth * 0.17},
		{
			field: 'status', 
			headerName: 'STATUS', 
			width: tableWidth * 0.18, 
			renderCell: (cellValues) => renderStatus(cellValues)
		}
	]

  const getUserShifts = async () => {
    let promises: Promise<Shift | undefined>[] = [];
		user.shiftsAssigned.map((shift) => {
			promises.push(getShift(user.houseID, shift))
			console.log(shift)
		})
    let shiftObjects = await Promise.all(promises);
    return shiftObjects;
  }

	const getRows = async () => {
		const rows: column[] = [];
		const shifts = await getUserShifts()
		shifts.map((shift) => {
			if (shift) {
				const row = {
					id: shift.shiftID, 
			 		shiftName: shift.name, 
					day: shift.assignedDay,
			 		time: parseTime(shift.timeWindow[0]) + " - " + parseTime(shift.timeWindow[1]),
			 		value: shift.hours + " hours", 
			 		status: shift.assignedDay 
				}
				rows.push(row)
			}
		})
		return rows
	}

	const searchBar = () => (
		<div className={styles.searchBar}>
			<TextField 
			  id = "outlined-basic" 
				label="Search" 
				variant="outlined"
				sx={{
					width: "53.6%",
					backgroundColor: "#FFFFFFFF",
				}}
				InputProps={{
					endAdornment: <InputAdornment position="start"><Icon type="search"/></InputAdornment>,
				}}
				/>
		</div>
	)

	return (
		// <div className={styles.center}>
		  <div className={styles.container}>
				{/* {searchBar()} */}
				<DataGrid
					rows = {rows}
					columns = {columns}
					className = {styles.schedule}
					rowHeight = {60}
					headerHeight = {50}
					sx={{
						"& .MuiDataGrid-columnSeparator": {
							display: "none"
						}
					}}
					onCellClick = {(row) => {
						//TODO: OPEN ANDREIS MODAL
					}}
					disableSelectionOnClick
				/>
			</div>
		// </div>
	)
}