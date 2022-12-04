import { Collapse, IconButton, MobileStepperClassKey, TableCell, TableContainer, TableRow, Table, TableBody } from "@mui/material"
import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

type CategoriesDropdownProps = {
    categoryMap: Map<string, string> | undefined,
    mapKey: string
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({mapKey, categoryMap}: CategoriesDropdownProps) => {
    /**
     * Displays an individual category and displays the shifts inside those categories on click.
     * 
     * @param mapKey - The name of the category
     * @param categoryMap - The map of categoryNames : shifts that is used to display information about the individual shifts
     * @returns CategoriesDropdown
     */
    
    // Stores whether the dropdown has been expanded / collapsed
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Expands / collapses the dropdown
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
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
