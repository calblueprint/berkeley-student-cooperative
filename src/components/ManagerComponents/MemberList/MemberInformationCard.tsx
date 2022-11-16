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
import { updateUser } from "../../../firebase/queries/user";
import { getAuth, updatePassword } from "firebase/auth";

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

  const initializeName = () => {
    if (user === undefined) {
      return "";
    }
    return user.name;
  };

  const initializeEmail = () => {
    if (user === undefined) {
      return "";
    }
    return user.email;
  };

  // Stores the input fields for the various changing fields
  const [name, setName] = useState(initializeName());
  const [email, setEmail] = useState(initializeEmail());

  // Updates the user's name, email, and password
  const updateUserObject = async () => {
    if (user === undefined) {
      return;
    }
    if (name.length == 0 || email.length == 0) {
      // Replace with modal
      console.log("Invalid Name or Email Length");
      return;
    }
    let newData = {
      name: name,
      email: email,
    };
    updateUser(user.userID, newData);
    closeModal();
  };

  // Closes the modal
  const closeModal = () => {
    setSelectedUser(undefined);
    setIsModalOpened(false);
  };

  // Updates name as the name field is edited
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  // Updates email as the email field is edited
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      {user && (
        <Dialog open={isModalOpened} onClose={closeModal} fullWidth={true}>
          <DialogTitle>{user && user.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>Name</DialogContentText>
            <TextField
              autoFocus
              value={name}
              onChange={handleNameChange}
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
