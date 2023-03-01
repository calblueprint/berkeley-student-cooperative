import { Paper } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useState, useEffect} from 'react';
import { getCategories } from "../../../firebase/queries/house";

const CategoryTable = () => {
    useEffect(() => {
        const [houseCategories, setHouseCategories] = useState<Map<string, (Map<string, string[]>)> | undefined>(undefined)
        console.log("hey there.")
        getCategories('EUC').then((category) => {
            
            const mapHolder = new Map<string, (Map<string, string[]>)>();
            
            // let preferences = authUser.preferences;
            const preferenceMap = new Map<string, string>();
            
            category.forEach((value, key) => {
                const inMapHold = value
                
                const categoriesMap = new Map<string, string[]>();
                inMapHold.forEach((val, k) => { 
                    if(val && k){
                       
                        categoriesMap.set("prefer goes here", [val, k]);
                    }
                    
                });
                
                 mapHolder.set(key,categoriesMap )
            })
            console.log("prefMap after loop", preferenceMap)
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
