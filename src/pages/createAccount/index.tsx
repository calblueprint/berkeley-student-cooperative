import {
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import { emailRegex } from "../../firebase/helpers";
import {
  getRowOfCSV,
  updateRowOfCSV,
} from "../../firebase/queries/csvManagement";
import Image from "next/image";
import BscLogo from "../../assets/bsclogo.png";
import styles from "./CreateAccount.module.css";

const CreateAccountPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useUserContext();

  const login = () => {
    router.push("/login");
  }

  // Updates name as the name field is edited
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  // Updates email as the email field is edited
  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

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
    if (csvInformation === null) {
      console.log("Invalid email");
      return;
    }
    if (csvInformation.accountCreated) {
      console.log("Account already created. Log in instead.");
      return;
    }
    if (csvInformation.houseID === undefined) {
      console.log("Invalid house ID");
      return;
    }
    if (
      csvInformation.firstName === undefined ||
      csvInformation.lastName === undefined
    ) {
      console.log("Invalid name");
      return;
    }
    try {
      await register(
        email,
        csvInformation.houseID,
        csvInformation.firstName,
        csvInformation.lastName,
        "member",
        password
      );
      let newData = {
        accountCreated: true,
      };
      await updateRowOfCSV(email, newData);
      router.push("/member/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className={styles.create}>
        <div className={styles.logo}>
          <Image src={BscLogo} alt="bsc logo" width={150} height={70} />
        </div>

        <div className={styles.card}>
          <div className={styles.body}>
            <Typography variant="body1" className={styles.text}>
              Email address
            </Typography>
            <TextField
              className={styles.textfield}
              autoFocus
              value={email}
              onChange={handleEmailChange}
              margin="dense"
              id="name"
              fullWidth
              variant="outlined"
            />
            <Typography variant="body1" className={styles.text}>
              Password
            </Typography>
            <TextField
              className={styles.textfield}
              autoFocus
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="dense"
              id="email"
              fullWidth
              variant="outlined"
            />
            <Typography className={styles.pwhelp} variant="caption">password must be 6+ characters with 1 number</Typography>
            <Typography variant="body1" className={styles.text}>
              Confirm Password
            </Typography>
            <TextField
              className={styles.textfield}
              autoFocus
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="dense"
              id="email"
              fullWidth
              variant="outlined"
            />
            <div className={styles.button}>
              <Button
                variant="contained"
                fullWidth
                disableElevation
                onClick={handleSubmit}
              >
                Create Account
              </Button>
            </div>
            <Button className={styles.login} onClick={login}>
            Already have an account? Log in here
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
