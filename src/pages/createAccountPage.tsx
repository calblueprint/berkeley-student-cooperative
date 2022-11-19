import { Button, InputLabel, TextField } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";

const CreateAccountPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectHouse, setHouse] = useState("");
    const { authUser, house, register, signIn, signOutAuth, establishUserContext } = useUserContext();
    
    // Updates name as the name field is edited
    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    const handleHouseChange = (event: any) => {
        setHouse(event.target.value);
    }

    // Updates email as the email field is edited
    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event: any) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = () => {
        let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!emailRegex.test(email)) {
            console.log("Invalid Email");
            return;
        }
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }
        
    }
    
    return (
        <div>
            <InputLabel>Email</InputLabel>
            <TextField
                autoFocus
                value = {email}
                onChange = {handleEmailChange}
                margin="dense"
                id="name"
                fullWidth
                variant="outlined"
            />
            <InputLabel>House</InputLabel>
            <TextField
                autoFocus
                value = {selectHouse}
                onChange = {handleHouseChange}
                margin="dense"
                id="name"
                fullWidth
                variant="outlined"
            />
            <InputLabel>Password</InputLabel>
            <TextField
                autoFocus
                type = "password"
                value = {password}
                onChange = {handlePasswordChange}
                margin="dense"
                id="email"
                fullWidth
                variant="outlined"
            />
            <InputLabel>Confirm Password</InputLabel>
            <TextField
                autoFocus
                type = "password"
                value = {confirmPassword}
                onChange = {handleConfirmPasswordChange}
                margin="dense"
                id="email"
                fullWidth
                variant="outlined"
            />
            <Button onClick = {handleSubmit}>Create Account</Button>
        </div>
    )
}

export default CreateAccountPage;