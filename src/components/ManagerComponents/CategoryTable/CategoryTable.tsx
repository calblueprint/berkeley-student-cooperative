import { Paper } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useState, useEffect} from 'react';


// type CategoryTableProps = {
//   users: User[];
//   shiftID: string;
//   selectedRows: string[];
//   setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
// };

const CategoryTable = () => {
    useEffect(() => {
        console.log("hey there.")
    }, [])

 
    return (
    <div>
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
            <TableRow>
                <TableCell>Insert Category Here:</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            <TableRow>
                <TableCell>Cooking Shift or Idk</TableCell>
            </TableRow>    
            </TableBody>
        </Table>
        </TableContainer>
    </div>
    );
};

export default CategoryTable;
