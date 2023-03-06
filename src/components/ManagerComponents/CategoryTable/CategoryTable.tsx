import { Paper, IconButton, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {useState, useEffect} from 'react';
import { getCategories } from "../../../firebase/queries/house";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from './CategoryTable.module.css'
const CategoryTable = () => {
    const [houseCategories, setHouseCategories] = useState<[string, Map<string,string>][] | undefined>(undefined)
    
    console.log("hey there.")
    useEffect(() => {
        
        getCategories('EUC').then((category) => {
            setHouseCategories(Object.entries(Object.fromEntries(category)))
        }
        )
    }, [])
    
 
    return (
    <div>
        {houseCategories?.map((category, index) => {
            return (
                <div key={index}>
                    <IndividualCategory category={category}/>
                    <br/>
                </div>
            )
        })}
        
    </div>
    );
};
type IndividualCategoryProps = {
    category: [string, Map<string, string>]
}
const IndividualCategory: React.FC<IndividualCategoryProps> = ({
    category,
  }: IndividualCategoryProps) => {
    // Stores whether the dropdown has been expanded / collapsed
    const [isExpanded, setIsExpanded] = useState(false)

    // Expands / collapses the dropdown
    const handleExpand = () => {
        setIsExpanded(!isExpanded)
    }
    const shiftNumDisplay = {fontSize: 18, backgroundColor: '#EFEFEF', padding: 1, marginBottom:1, marginLeft: 1, borderRadius: 1}

    const shiftItems = Object.entries(Object.fromEntries(category[1]));
    return (
        
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontSize: 32}}>
                            <IconButton onClick={handleExpand}>
                                {isExpanded ? <KeyboardArrowDownIcon sx={{fontSize: 32, color:'black'}}/> : <KeyboardArrowRightIcon sx={{fontSize: 32, color:'black'}}/>}
                            </IconButton>    
                            {category[0]} {shiftItems.length == 1 ? <Typography sx={shiftNumDisplay} className={styles.numShifts}>1 shift</Typography> : <Typography sx={shiftNumDisplay} className={styles.numShifts}>{shiftItems.length} shifts</Typography> }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                
                    {isExpanded && shiftItems?.map((value, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell sx={{fontSize: 18, marginLeft: 28}} >{value[1]}</TableCell>
                            </TableRow>   
                        )
                    })}
                    
                </TableBody>
            </Table>
        </TableContainer>
                
               
                
    )
}

export default CategoryTable;
