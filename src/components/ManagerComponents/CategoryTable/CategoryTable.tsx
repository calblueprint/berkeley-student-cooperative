import { Paper } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";


// type CategoryTableProps = {
//   users: User[];
//   shiftID: string;
//   selectedRows: string[];
//   setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
// };

const CategoryTable = () => {
 
  return (
    <div>
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              Hey
            </TableRow>
          </TableHead>
          <TableBody>
            
                <TableCell padding="none">
                    Hey? with uncertainty
                  <Checkbox
                    color="primary"
                    // checked={selectedRows.includes(row.id)}
                    
                  />
                </TableCell>
                
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CategoryTable;
