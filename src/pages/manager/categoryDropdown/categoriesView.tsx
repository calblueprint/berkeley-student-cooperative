import { useEffect, useState } from "react"
import { addCategory, getHouse, updateHouse } from "../../../firebase/queries/house"
import { House } from "../../../types/schema"
import CategoriesDropdown from "./CategoriesDropdown"
import Button from "@mui/material/Button";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableContainer, TextField } from "@mui/material";
import { mapToObject } from "../../../firebase/helpers";
import styles from './CategoriesView.module.css';

type CategoriesViewProps = {
    houseID: string
}

const CategoriesView: React.FC<CategoriesViewProps> = ({houseID}: CategoriesViewProps) => {
    const [house, setHouse] = useState<House>();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const retrieveHouse = async () => {
        let h = await getHouse(houseID);
        setHouse(h);
    }

    useEffect(() => {
        retrieveHouse();
    }, []);

    const openModal = () => {
        setIsModalOpened(true);
    }

    const handleCategoryNameChange = (event: any) => {
        setNewCategoryName(event.target.value);
    }

    const closeModal = () => {
        setIsModalOpened(false);
        setNewCategoryName("");
    }

    const uploadCategory = async () => {
        if (house !== undefined) {
            house.categories.set(newCategoryName, new Map<string, string>());
            await addCategory(houseID, newCategoryName);
            setHouse(house);
        }
        setIsModalOpened(false);
        setNewCategoryName("");
    }

    return (
        <div className = {styles.categoryViewContainer}>
            <Button onClick = {openModal} id = {styles.newCategory}>New Category</Button>
            <TableContainer>
                <Table >
                    <TableBody>
                        {
                            house && Array.from(house.categories.keys()).map((key, index) => (
                                <CategoriesDropdown key = {index} mapKey = {key} categoryMap = {house.categories.get(key)}></CategoriesDropdown>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                isModalOpened && (
                    <Dialog open = {isModalOpened} fullWidth = {true}>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Category Name</DialogContentText>
                            <TextField
                            autoFocus
                            value={newCategoryName}
                            onChange={handleCategoryNameChange}
                            margin="dense"
                            id="name"
                            fullWidth
                            variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeModal}>Cancel</Button>
                            <Button onClick={uploadCategory}>Create New Category</Button>
                        </DialogActions>
                    </Dialog>
                )
            }
        </div>
    )
}

export default CategoriesView;