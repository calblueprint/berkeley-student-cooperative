import {
  Checkbox,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { convertNumberIntoMonetaryValue } from "../../../firebase/helpers";
import { getAllUserObjectsFromHouse } from "../../../firebase/queries/user";
import { User } from "../../../types/schema";
import MemberInformationCard from "./MemberInformationCard";

type MemberListProps = {
  houseID: string;
};

const MemberList: React.FC<MemberListProps> = ({
  houseID,
}: MemberListProps) => {
  // Stores all of the users
  const [users, setUsers] = useState<User[]>([]);
  // Stores the users translated into row objects
  const [userRows, setUserRows] = useState<RowData[]>([]);
  // Boolean storing whether the modal has been opened or not
  const [isModalOpened, setIsModalOpened] = useState(false);
  // Stores the selected user once clicked on
  const [selectedUser, setSelectedUser] = useState<User>();

  // Data structure of a row
  type RowData = {
    id: string;
    name: string;
    email: string;
    totalFines: string;
  };

  // Column headers
  type Column = {
    id: "Name" | "Email" | "Total Fines";
    minWidth: number;
  };

  const columns: Column[] = [
    {
      id: "Name",
      minWidth: 170,
    },
    {
      id: "Email",
      minWidth: 170,
    },
    {
      id: "Total Fines",
      minWidth: 170,
    },
  ];

  // Creates an individual row given a user
  const createRow = (user: User): RowData => {
    let name = user.name;
    let id = user.userID;
    let email = user.email;
    let totalFines = convertNumberIntoMonetaryValue(user.totalFines);
    let newRow = {
      id,
      name,
      email,
      totalFines,
    };
    return newRow;
  };

  // Retrieves all user objects associated with a house on load
  useEffect(() => {
    retrieveUserObjects();
  }, []);

  // Retrieves all user objects associated with a house whenever the modal is opened / closed (update if change info)
  useEffect(() => {
    retrieveUserObjects();
  }, [isModalOpened]);

  const retrieveUserObjects = async () => {
    let userObjects: User[] = await getAllUserObjectsFromHouse(houseID);
    setUsers(userObjects);
    let ret = [];
    for (let i = 0; i < userObjects.length; i++) {
      ret.push(createRow(userObjects[i]));
    }
    setUserRows(ret);
  };

  // Pops up the user modal by setting the selected user and setting ismodalOpened to true
  const popUpUserModal = (row: RowData) => {
    let user = users.find((user) => user.userID === row.id);
    setSelectedUser(user);
    setIsModalOpened(true);
  };

  return (
    <div>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
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
            {userRows.map((row, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => {
                  popUpUserModal(row);
                }}
              >
                <TableCell align="center"> {row.name}</TableCell>
                <TableCell align="center"> {row.email}</TableCell>
                <TableCell align="center"> {row.totalFines}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isModalOpened && (
        <MemberInformationCard
          user={selectedUser}
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          setSelectedUser={setSelectedUser}
        />
      )}
    </div>
  );
};

export default MemberList;
