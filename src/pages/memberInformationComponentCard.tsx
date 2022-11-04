import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import React, { useState } from "react"
import { User } from "../types/schema"
import {updateUser} from "../firebase/queries/user"
import { getAuth, updatePassword } from "firebase/auth";

type MemberInformationComponentCardProps = {
    user: User | undefined,
    isModalOpened: boolean,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const MemberInformationComponentCard: React.FC<MemberInformationComponentCardProps> = ({user, isModalOpened, setIsModalOpened, setSelectedUser}: MemberInformationComponentCardProps) => {
    const auth = getAuth();
    auth.currentUser
    // checks if the password contains a number and the length of the password is at least 6
    const satisfyPasswordConstraints = () => {
        return /\d/.test(newPassword) && newPassword.length >= 6;
    }

    const initializeName = () => {
        if (user === undefined) {
            return "";
        }
        return user.name;
    }
    
    const initializeEmail = () => {
        console.log(auth.currentUser);
        if (user === undefined) {
            return "";
        }
        return user.email;
    }

    // Stores the input fields for the various changing fields
    const [name, setName] = useState(initializeName());
    const [email, setEmail] = useState(initializeEmail());
    const [newPassword, setNewPassword] = useState("");
    
    // Updates the user's name, email, and password
    const updateUserObject = async () => {
        if (user === undefined) {
            return;
        }
        if (name.length == 0 || email.length == 0) {
            console.log("Invalid Name or Email Length");
            return;
        }
        let newData = {
            name: name,
            email: email
        }
        if (auth.currentUser !== null && satisfyPasswordConstraints()) {
            console.log("success");
            await updatePassword(auth.currentUser, newPassword);
        } else {
            // Replace with modal
            console.log("invalid");
        }
        updateUser(user.userID, newData);
        closeModal();
    }

    // Closes the modal
    const closeModal = () => {
        setSelectedUser(undefined);
        setIsModalOpened(false);
    }

    // Updates name as the name field is edited
    const handleNameChange = (event: any) => {
        setName(event.target.value);
    }

    // Updates email as the email field is edited
    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    // Updates the password as the password field is edited
    const handlePasswordChange = (event: any) => {
        setNewPassword(event.target.value);
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
                        <DialogContentText>
                            Password
                        </DialogContentText>
                        <TextField
                            autoFocus
                            value = {newPassword}
                            onChange = {handlePasswordChange}
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