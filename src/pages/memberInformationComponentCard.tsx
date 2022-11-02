import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import React, { useState } from "react"
import { User } from "../types/schema"
import {updateUser} from "../firebase/queries/user"

type MemberInformationComponentCardProps = {
    user: User | undefined,
    isModalOpened: boolean,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const MemberInformationComponentCard: React.FC<MemberInformationComponentCardProps> = ({user, isModalOpened, setIsModalOpened, setSelectedUser}: MemberInformationComponentCardProps) => {
    const initializeName = () => {
        if (user === undefined) {
            return "";
        }
        return user.name;
    }
    
    const initializeEmail = () => {
        if (user === undefined) {
            return "";
        }
        return user.email;
    }

    const [name, setName] = useState(initializeName());
    const [email, setEmail] = useState(initializeEmail());
    
    
    const updateUserObject = () => {
        if (user === undefined) {
            return;
        }
        let newData = {
            name: name,
            email: email
        }
        updateUser(user.userID, newData);
        closeModal();
    }

    const closeModal = () => {
        setSelectedUser(undefined);
        setIsModalOpened(false);
    }

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    }

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    return  (
        <div>
            {user && 
                <Dialog open = {isModalOpened} onClose = {closeModal} fullWidth = {true}>
                    <DialogTitle>{user && user.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Name
                        </DialogContentText>
                        <TextField
                            autoFocus
                            value = {name}
                            onChange = {handleNameChange}
                            margin="dense"
                            id="name"
                            fullWidth
                            variant="standard"
                        />
                        <DialogContentText>
                            Email
                        </DialogContentText>
                        <TextField
                            autoFocus
                            value = {email}
                            onChange = {handleEmailChange}
                            margin="dense"
                            id="email"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick = {closeModal}>Cancel</Button>
                        <Button onClick = {updateUserObject}>Save</Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    )
}

export default MemberInformationComponentCard;