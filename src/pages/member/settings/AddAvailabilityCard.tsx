import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import AddAvailabilityForm from "./AddAvailabilityForm";

import styles from './AvailabilityTabContent.module.css'

const AddAvailabilityCard = ({
    addAvailability,
    resetAvailabilities
}: {
    addAvailability: (startTime: number, endTime: number, startDay: string, endDay: string) => void,
    resetAvailabilities: () => void
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => {
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }
    
    return (
        <>
            <Box className = {styles.float}>
                <Button onClick = {resetAvailabilities}>Reset Availability</Button>
                <Button onClick = {handleOpen}>New Availability</Button>
            </Box>
            <Dialog
                fullWidth
                maxWidth="md"
                open={showModal}
                onClose={handleClose}
                className="dialog"
            >
                <DialogTitle variant="h4" component="h2">
                Availability
                </DialogTitle>
                <DialogContent>
                <AddAvailabilityForm
                    setOpen={setShowModal}
                    addAvailability = {addAvailability}
                />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddAvailabilityCard;