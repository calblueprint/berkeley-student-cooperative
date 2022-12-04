import React, {useState, useEffect} from "react";
import { User, Shift } from "../../../../types/schema";
import { Typography, Card, TextField, InputAdornment } from '@mui/material';
import styles from "./MemberShiftSchedule.module.css";
import { MemberScheduleHeader } from "../MemberScheduleHeader/MemberScheduleHeader";
import {DataGrid, GridColDef, GridColumns, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { getShift } from "../../../../firebase/queries/shift";
import useWindowDimensions from "../../../../helpers/helpers";
import { parseTime } from "../../../../firebase/helpers";
import Icon  from "../../../../assets/Icon"
import { borderRadius, fontSize, fontWeight } from "@mui/system";


type MemberShiftScheduleProps = {
	user: User;
}

type row = {
	id: string,
	shiftName: string,
	time: string,
	value: string,
	status: string,
}


export const MemberShiftSchedule: React.FunctionComponent<MemberShiftScheduleProps> = ({user}) => {
	
	//height and width of the window; used to calculate col widths in table
	const { height, width } = useWindowDimensions();

	//state variable that calculates the total width of table, connected to width
	const [tableWidth, setTableWidth] = useState((width - 197) * 0.92)

	//state variable that holds the rows that display in the main data grid table
	const [rows, setRows] = useState<row[]>([])

	/**
 	* useEffect that sets the tableWidth as the width from window changes 
 	*/
	useEffect(() => {
		//UPDATE THIS LOGIC TO ADJUST TABLE WIDTH W/OUT USEEFFECT?
		setTableWidth((width - 197) * 0.92);
	}, [width])

	/**
	 * useEffect to call getRows() and then setRows to update the table values everytime that the page is refreshed, changed, etc
	*/
	useEffect(() => {
		const fetchRows = async () => {
			const rows = await getRows()
			setRows(rows)
		}
		fetchRows()
	}, [])

	/**
	 * Render the status column for each row 
	 * 
	 * @TODO update logic to check if shift has been verified; currently  using Sat Sun to be incomplete, o.w. complete
	 *
	 * @param cellValues: the row type object that is passed into the renderCell function
	 * 
	 * @returns div 
	 */	
	const renderStatus = (cellValues: any) => {
		return (
			<div className={styles.status}>
				{
					cellValues.row.day[0] != "S"
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

	/**
	 * Array of columns that are passsed into the data grid
	 */
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

	/**
	 * Async function that returns the shift objects for the user using shift IDs form shiftsAssigned and calling getShift()
	 * Used in getRows()
	 *
	 * No params
	 * 
	 * @returns Array of shift objects
	 */

  const getUserShifts = async () => {
    let promises: Promise<Shift | undefined>[] = [];
		user.shiftsAssigned.map((shift) => {
			promises.push(getShift(user.houseID, shift))
			console.log(shift)
		})
    let shiftObjects = await Promise.all(promises);
    return shiftObjects;
  }

	/**
	 * Async function to return all the rows that are displayed 
	 * Calls getUserShifts() which returns all the shifts objects
	 * Formats the shift object to row type using map and returns array of all the row objects
	 *
	 * No params
	 * 
	 * @returns array of row type objects 
	 */

	const getRows = async () => {
		const rows: row[] = [];
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

	/**
	 * Search bar that is used to search through the schedule
	 *
	 * @TODO update logic to update the rows based on starting value, given the input
	 * 
	 * @returns search bar div
	 */

	const searchBar = () => (
		<TextField 
			label="Search" 
			sx={{
				width: "53.6%",
				backgroundColor: "#FFFFFFFF",
				borderRadius: "5px",
				border: "0.75px solif #E2E2E2"
			}}
			InputProps={{
				endAdornment: <InputAdornment position="start"><Icon type="search"/></InputAdornment>,
			}}
			/>
	)

	return (
		<div className={styles.component}>
		  <div className={styles.container}>
				{searchBar()}
				<DataGrid
					rows = {rows}
					columns = {columns}
					className = {styles.schedule}
					rowHeight = {60}
					headerHeight = {50}
					sx={{
						borderRadius: "10px",
						border: "0.5px solid #E2E2E2",
						"& .MuiDataGrid-columnSeparator": {
							display: "none"
						},
						"& .MuiDataGrid-cell": {
							paddingLeft: "20px"
						},
						"& .MuiDataGrid-columnHeader": {
							paddingLeft: "20px"						
						},
						"& .MuiDataGrid-columnHeaderTitle": {
							fontWeight: "600",
						},
					}}
					onCellClick = {(row) => {
						//TODO: OPEN ANDREIS MODAL
					}}
					disableSelectionOnClick
				/>
			</div>
	 </div>
	)
}