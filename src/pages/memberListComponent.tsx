import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { convertNumberIntoMonetaryValue } from "../firebase/helpers"
import { getAllUserObjectsFromHouse } from "../firebase/queries/user"
import { User } from "../types/schema"

type MemberListComponentProps = {
    houseID: string
}

const MemberListComponent: React.FC<MemberListComponentProps> = ({houseID}: MemberListComponentProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [userRows, setUserRows] = useState<RowData[]>([]);

    type RowData = {
        id: string,
        name: string,
        email: string,
        totalFines: string
    }

    type Column = {
        id: "Name" | "Email" | "Total Fines";
        minWidth: number;
    }

    const columns: Column[] = [
        {
            id: "Name",
            minWidth: 170
        },
        {
            id: "Email",
            minWidth: 170
        },
        {
            id: "Total Fines",
            minWidth: 170
        }
    ]

    const createRow = (user: User): RowData => {
        let name = user.name;
        let id = user.userID;
        let email = user.email;
        let totalFines = convertNumberIntoMonetaryValue(user.totalFines);
        let newRow = {
            id, 
            name,
            email,
            totalFines
        };
        return newRow;
    }


    useEffect(() => {
        retrieveUserObjects();
    }, []);

    const retrieveUserObjects = async () => {
        let userObjects: User[] = await getAllUserObjectsFromHouse(houseID);
        setUsers(userObjects);
        let ret = [];
        for (let i = 0; i < userObjects.length; i++) {
            ret.push(createRow(userObjects[i]));
        }
        setUserRows(ret);
    }

    const popUpUserModal = (row: RowData) => {
        let user = users.find(user => user.userID === row.id);
        console.log(user);
    }

    return (
        <div>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {
                                columns.map((column) => (
                                    <TableCell key = {column.id} align = "center" style = {{minWidth: column.minWidth}}>{ column.id }</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            userRows.map((row, index) => (
                                <TableRow key = {index} hover onClick = {() => {popUpUserModal(row)}}>
                                    <TableCell align = "center"> {row.name}</TableCell>
                                    <TableCell align = "center"> {row.email}</TableCell>
                                    <TableCell align = "center"> {row.totalFines}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default MemberListComponent;