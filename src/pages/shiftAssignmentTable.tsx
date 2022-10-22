
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { User } from "../types/schema";


type ShiftAssignmentTableProps = {
    users: User[],
    shiftID: string
}

const ShiftAssignmentTable: React.FC<ShiftAssignmentTableProps> = ({users, shiftID} : ShiftAssignmentTableProps) => {
    type RowData = {
        id: string, 
        name: string,
        hoursRemaining: number,
        preference: string
    }
    
    type Column = {
        id: "Available" | "Down Hours" | "Preference";
        minWidth: number;

    }
    const createRow = (user: User) : RowData => {
        let name = user.name;
        let hoursRemaining = user.hoursRemainingWeek;
        // convert number preference to string preference
        let numberToText = new Map<number, string>();
        numberToText.set(0, "dislikes");
        numberToText.set(1, "");
        numberToText.set(2, "prefers");
        let stringPreference = "";
        if (user.preferences.has(shiftID)) {
            let numericalPreference = user.preferences.get(shiftID);
            if (numericalPreference !== undefined && numberToText.has(numericalPreference)) {
                let newPref = numberToText.get(numericalPreference);
                if (newPref !== undefined) {
                    stringPreference = newPref;
                }
            }
        }
        let preference = stringPreference;
        let id = user.userID;
        let newRow = {
            id,
            name,
            hoursRemaining,
            preference
        };
        return newRow;
    }

    const initializeRows = () => {
        let ret = [];
        for (let i = 0; i < users.length; i++) {
            ret.push(createRow(users[i]));
            ret.push(createRow(users[i]));
            ret.push(createRow(users[i]));
            ret.push(createRow(users[i]));
        }
        return ret;
    }

    const rows = initializeRows();

    const initializeSelected = () => {
        let ret = [];
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let assignedShifts = user.shiftsAssigned;
            if (assignedShifts.includes(shiftID)) {
                ret.push(user.userID);
            }
        }
        return ret;
    }
    // list of userIDs
    const [selectedRows, setSelectedRows] = useState(initializeSelected());

    const columns: Column[] = [
        {
            id: "Available",
            minWidth: 170
        }, 
        {
            id: "Down Hours",
            minWidth: 170
        },
        {
            id: "Preference",
            minWidth: 170
        }
    ]

    const handleClick = (userID: string) => {
        let copy = [...selectedRows];
        let index = copy.indexOf(userID);
        if (index > -1) {
            copy.splice(index, 1);
        } else {
            copy.push(userID);
        }
        setSelectedRows(copy);
    }

    return (
        <div>
            <TableContainer sx = {{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding = "checkbox" />
                            {
                                columns.map((column) => (
                                    <TableCell key = {column.id} align = "center" style = {{minWidth: column.minWidth}}>{ column.id }</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.map((row, index) => (
                                <TableRow hover role = "checkbox" key = {index} onClick = {(event) => handleClick(row.id)}>
                                    <TableCell padding = "none">
                                        <Checkbox
                                            color="primary"
                                            checked={ selectedRows.includes(row.id) }
                                            />
                                    </TableCell>
                                    <TableCell padding = "none" align = "center"> {row.name}</TableCell>
                                    <TableCell align = "center"> {row.hoursRemaining}</TableCell>
                                    <TableCell align = "center"> {row.preference}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ShiftAssignmentTable;