import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { User } from "../../../types/schema";
import { getUser, updateUser } from "../../../firebase/queries/user";
import { getAuth, updatePassword } from "firebase/auth";
import { emailRegex } from '../../../firebase/helpers';

type MemberInformationCardProps = {
  user: User | undefined;
  isModalOpened: boolean;
  setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const MemberInformationCard: React.FC<MemberInformationCardProps> = ({
  user,
  isModalOpened,
  setIsModalOpened,
  setSelectedUser,
}: MemberInformationCardProps) => {
  const auth = getAuth();

  const initializeFirstName = () => {
    if (user === undefined) {
      return "";
    }
    return user.firstName;
  };

  const initializeLastName = () => {
    if (user === undefined) {
      return "";
    }
    return user.lastName;
  }

  const initializeEmail = () => {
    if (user === undefined) {
      return "";
    }
    return user.email;
  };

  // Stores the input fields for the various changing fields
  const [firstName, setFirstName] = useState(initializeFirstName());
  const [lastName, setLastName] = useState(initializeLastName());
  const [email, setEmail] = useState(initializeEmail());

  // Updates the user's name, email, and password
  const updateUserObject = async () => {
    if (user === undefined) {
      return;
    }
    if (firstName.length == 0 || email.length == 0 || lastName.length == 0) {
      // Replace with modal
      console.log("Invalid Name or Email Length");
      return;
    }
    if (!emailRegex.test(email)) {
      console.log("Invalid Email");
      return;
    }
    let newData = {
      firstName: firstName,
      lastName: lastName,
      email: email
    };
    console.log("BEFORE");
    console.log(getUser(user.userID));
    updateUser(user.userID, newData);
    console.log("AFTER");
    console.log(getUser(user.userID));
    closeModal();
  };

  // Closes the modal
  const closeModal = () => {
    setSelectedUser(undefined);
    setIsModalOpened(false);
  };

  // Updates name as the name field is edited
  const handleFirstNameChange = (event: any) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: any) => {
    setLastName(event.target.value);
  }

  // Updates email as the email field is edited
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      {user && (
        <Dialog open={isModalOpened} onClose={closeModal} fullWidth={true}>
          <DialogTitle>{user && user.firstName + " " + user.lastName}</DialogTitle>
          <DialogContent>
            <DialogContentText>First Name</DialogContentText>
            <TextField
              autoFocus
              value={firstName}
              onChange={handleFirstNameChange}
              margin="dense"
              id="name"
              fullWidth
              variant="standard"
            />
            <DialogContentText>Last Name</DialogContentText>
            <TextField
              autoFocus
              value={lastName}
              onChange={handleLastNameChange}
              margin="dense"
              id="name"
              fullWidth
              variant="standard"
            />
            <DialogContentText>Email</DialogContentText>
            <TextField
              autoFocus
              value={email}
              onChange={handleEmailChange}
              margin="dense"
              id="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button onClick={updateUserObject}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MemberInformationCard;
