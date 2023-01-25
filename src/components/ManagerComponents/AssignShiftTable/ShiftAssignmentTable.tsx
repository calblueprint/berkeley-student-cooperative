import { Paper } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { numericToStringPreference } from "../../../firebase/helpers";
import { User } from "../../../types/schema";

type ShiftAssignmentTableProps = {
  users: User[];
  shiftID: string;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
};

const ShiftAssignmentTable: React.FC<ShiftAssignmentTableProps> = ({
  users,
  shiftID,
  selectedRows,
  setSelectedRows,
}: ShiftAssignmentTableProps) => {
  /**
   * The table that is rendered in the ShiftAssignmentComponentCard.
   * Supports checking and unchecking users.
   *
   * @param users - List of user objects that are available for the shift
   * @param shiftID - The ID of the shift
   * @param selectedRows - The rows that have been selected for the shift
   * @param setSelectedRows - Updates the selectedRows variables
   * @returns ShiftAssignmentTable
   */

  // Row data type
  type RowData = {
    // id of the rows (userID)
    id: string;
    // name of the person
    name: string;
    // hours this person has left to be assigned
    hoursRemaining: number;
    // their preference in the form of a string
    preference: string;
  };

  // Columns of table
  type Column = {
    id: "Available" | "Unassigned Hours" | "Preference";
    minWidth: number;
  };

  // Creates a row of the table given a user
  const createRow = (user: User): RowData => {
    console.log({ uid: user.userID, user: user });
    let name = user.firstName + " " + user.lastName;
    let hoursRemaining = user.hoursRequired - user.hoursAssigned;
    let preference = numericToStringPreference(user, shiftID);
    let id = user.userID;
    let newRow = {
      id,
      name,
      hoursRemaining,
      preference,
    };
    return newRow;
  };

  // Initializes all of the rows of the table
  const initializeRows = () => {
    let ret = [];
    console.log({ Users: users });
    for (let i = 0; i < users.length; i++) {
      ret.push(createRow(users[i]));
    }
    return ret;
  };

  const rows = initializeRows();

  // Initializes all of the columns of the table
  const columns: Column[] = [
    {
      id: "Available",
      minWidth: 170,
    },
    {
      id: "Unassigned Hours",
      minWidth: 170,
    },
    {
      id: "Preference",
      minWidth: 170,
    },
  ];

  // Sets the selectedRows onClick
  const handleClick = (userID: string) => {
    let copy = [...selectedRows];
    let index = copy.indexOf(userID);
    if (index > -1) {
      copy.splice(index, 1);
    } else {
      copy.push(userID);
    }
    setSelectedRows(copy);
  };

  return (
    <div>
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.id}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                hover
                role="checkbox"
                key={index}
                onClick={(event) => handleClick(row.id)}
              >
                <TableCell padding="none">
                  <Checkbox
                    color="primary"
                    checked={selectedRows.includes(row.id)}
                  />
                </TableCell>
                <TableCell align="center"> {row.name}</TableCell>
                <TableCell align="center"> {row.hoursRemaining}</TableCell>
                <TableCell align="center"> {row.preference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShiftAssignmentTable;
