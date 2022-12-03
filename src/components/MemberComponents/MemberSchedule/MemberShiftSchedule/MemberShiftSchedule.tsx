import React, {useState, useEffect} from "react";
import { User, Shift } from "../../../../types/schema";
import { Typography, Card, TextField } from '@mui/material';
import styles from "./MemberShiftSchedule.module.css";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";
import { MemberScheduleHeader } from "../MemberScheduleHeader/MemberScheduleHeader";
import {DataGrid, GridColDef, GridColumns, GridValueGetterParams } from '@mui/x-data-grid';
import { getShift } from "../../../../firebase/queries/shift";


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

	useEffect(() => {
		const fetchRows = async () => {
			const rows = await getRows()
			setRows(rows)
		}
		fetchRows()
	}, [])

	const columns: GridColDef[] = [
		{field: 'shiftName', headerName: 'SHIFT NAME', width: width * 0.44},
		{field: 'time', headerName: 'TIME', width: width * 0.14},
		{field: 'value', headerName: 'VALUE', width: width * 0.14},
		{field: 'status', headerName: 'STATUS', width: width * 0.12},
	]

  const getUserShifts = async () => {
    let promises: Promise<Shift | undefined>[] = [];
		user.shiftsAssigned.map((shift) => {
			promises.push(getShift(user.houseID, shift))
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
			 		time: shift.timeWindow[0] + " - " + shift.timeWindow[1],
			 		value: shift.hours + " hours", 
			 		status: shift.verification ? "Complete" : "Incomplete" 
				}
				rows.push(row)
			}
		})
		return rows

	}

	return (
		  <div className={styles.container}>
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
						//OPEN ANDREIS MODAL
					}}
					// disableSelectionOnClick
				/>
			</div>
	)
}

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height
	};
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}