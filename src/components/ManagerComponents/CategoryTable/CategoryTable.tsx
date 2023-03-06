import { Paper, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useState, useEffect} from 'react';
import { getCategories } from "../../../firebase/queries/house";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const CategoryTable = () => {
    const [houseCategories, setHouseCategories] = useState<[string, Map<string,string>][] | undefined>(undefined)
    // Stores whether the dropdown has been expanded / collapsed
    const [isExpanded, setIsExpanded] = useState(false)

    // Expands / collapses the dropdown
    const handleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    console.log("hey there.")
    useEffect(() => {
        
        getCategories('EUC').then((category) => {
            const check = Object.entries(Object.fromEntries(category))
            console.log("should be map", check[0][1])
            setHouseCategories(Object.entries(Object.fromEntries(category)))
        }
        )
    }, [])
    
 
    return (
    <div>
        {houseCategories?.map((category, index) => {
            return (
                <div key={index}>
                    <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <IconButton onClick={handleExpand}>
                                            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>    
                                        {category[0]}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            
                                {isExpanded && Object.entries(Object.fromEntries(category[1]))?.map((value, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{value[1]}</TableCell>
                                        </TableRow>   
                                    )
                                })}
                                
                            </TableBody>
                        </Table>
                    </TableContainer>
                
                    <br/>
                </div>
                
            )
        })}
        
    </div>
    );
};

export default CategoryTable;
