import { Button, InputLabel, TextField } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useRouter } from "next/router";
import { emailRegex } from "../firebase/helpers";
import { getAllHouses } from "../firebase/queries/house";
import { getRowOfCSV } from "../firebase/queries/csvManagement";
import { reauthenticateWithCredential } from "firebase/auth";

const CreateAccountPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { authUser, house, register, signIn, signOutAuth, establishUserContext } = useUserContext();
    
    // Updates name as the name field is edited
    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    // Updates email as the email field is edited
    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event: any) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = async () => {
        if (!emailRegex.test(email)) {
            console.log("Invalid Email");
            return;
        }
        if (password.length < 6) {
            console.log("Password must be 6 characters or longer");
            return;
        }
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }
        let csvInformation = await getRowOfCSV(email);
        console.log(csvInformation);
        if (csvInformation === null) {
            console.log("Invalid email");
            return;
        }
        if (csvInformation.houseID === undefined) {
            console.log("Invalid house ID");
            return;
        }
        if (csvInformation.firstName === undefined || csvInformation.lastName === undefined) {
            console.log("Invalid name");
            return;
        }
        // register(email, csvInformation.firstName, csvInformation.lastName, csvInformation.houseID, password, "member");
        router.push('/member/dashboard');
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