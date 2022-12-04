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
    /**
     * Displays the shift categories in a house and provides the ability to add a new category.
     * Each shift category is a drop-down, such that when clicked, it displays all of the shifts under that category.
     * 
     * @param houseID - The ID of the house.
     * @returns CategoriesView
     */
    
    // Retrieved house object
    const [house, setHouse] = useState<House>();
    // Stores whether the modal to create a new category is opened
    const [isModalOpened, setIsModalOpened] = useState(false);
    // Stores the new category name
    const [newCategoryName, setNewCategoryName] = useState("");

    // Retrieves the house object given the houseID
    const retrieveHouse = async () => {
        let h = await getHouse(houseID);
        setHouse(h);
    }

    useEffect(() => {
        retrieveHouse();
    }, []);

    // Opens modal
    const openModal = () => {
        setIsModalOpened(true);
    }

    // Updates the newCategoryName state as the user types in
    const handleCategoryNameChange = (event: any) => {
        setNewCategoryName(event.target.value);
    }

    // Closes the modal without pushing anything to firebase
    const closeModal = () => {
        setIsModalOpened(false);
        setNewCategoryName("");
    }

    // Uploads the new category to Firebase if the category doesn't exist yet
    const uploadCategory = async () => {
        if (house !== undefined) {
            let successful  = await addCategory(houseID, newCategoryName);
            if (successful) {
                house.categories.set(newCategoryName, new Map<string, string>());
                setHouse(house);
            }
        }
        closeModal();
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