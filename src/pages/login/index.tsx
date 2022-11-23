import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import BscLogo from "../../assets/bsclogo.png";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/queries/auth";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, authUser } = useFirebaseAuth();

  const login = async () => {
    if (email.length > 0 && password.length > 0) {
      await signIn(email, password);
    }
  };

  useEffect(() => {
    if (authUser.userID != "") {
      if (authUser.role == "Member") {
        router.push("/member/dashboard");
      }
      router.push("/manager/schedule");
    }
  });
  return authUser.userID != "" ? (
    <Layout />
  ) : (
    <div className={styles.login}>
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
            fullWidth
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Typography variant="body1" className={styles.text}>
            Password
          </Typography>
          {/* <input type="password" name="psswd"></input> */}
          <TextField
            className={styles.textfield}
            fullWidth
            value={password}
            type={"password"}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <div className={styles.flex}>
            <FormControlLabel
              className={styles.checkbox}
              control={<Checkbox />}
              label="Remember me"
            />
            <Typography className={styles.forgotPW}>
              Forgot your password?
            </Typography>
          </div>
          <Button
            className={styles.button}
            variant="contained"
            fullWidth
            disableElevation
            onClick={login}
          >
            Login
          </Button>
          <Typography className={styles.createAccount}>
            Create an account
          </Typography>
        </div>
      </div>
    </div>
  );
}
