import { Collapse, IconButton, MobileStepperClassKey, TableCell, TableContainer, TableRow, Table, TableBody } from "@mui/material"
import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material'
import KeyboardArrowUpIcon from '@mui/icons-material'

type CategoriesDropdownProps = {
    categoryMap: Map<string, string> | undefined,
    mapKey: string
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({mapKey, categoryMap}: CategoriesDropdownProps) => {

    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
        console.log("hel");
    }

    return (
        <>
            <TableRow>
                <TableCell padding="checkbox">
                    <IconButton onClick={handleExpand}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    {mapKey}
                </TableCell>

            </TableRow>
            
            {
                isExpanded && categoryMap && Array.from(categoryMap.keys()).map((shiftID, index) => (
                    <TableRow key = {index}>
                        <TableCell padding = "checkbox">
                            {categoryMap.get(shiftID)}
                        </TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}

export default CategoriesDropdown;
