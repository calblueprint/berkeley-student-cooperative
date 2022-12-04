import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getHouse } from "../../../firebase/queries/house";
import {
  getUser,
  generatePinNumber,
  updateUser,
} from "../../../firebase/queries/user";
import { House, User } from "../../../types/schema";
import styles from "./SettingsInfo.module.css";

type SettingsInfoProps = {
  userID: string;
};

const SettingsInfo: React.FC<SettingsInfoProps> = ({
  userID,
}: SettingsInfoProps) => {
  /**
   * Returns a card component to display a member's personal information in the settings page
   *
   * @param userID - ID of the member
   */
  const [user, setUser] = useState<User | null>();
  const [house, setHouse] = useState<House | null>();
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [pin, setPin] = useState<number | null>();
  let star = "*";

  useEffect(() => {
    // retrieves user from context
    const getData = async () => {
      const currUser = await getUser(userID);
      setUser(currUser);
    };
    getData();
  }, [userID]);

  useEffect(() => {
    setName(user?.firstName + " " + user?.lastName);
    setEmail(user?.email);
    setPin(user?.pinNumber);
    const getData = async () => {
      if (user) {
        const currHouse = await getHouse(user.houseID);
        setHouse(currHouse);
      }
    };
    getData();
  }, [user]);

  const handleOpen = () => {
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const resetPin = async () => {
    let newPin = generatePinNumber(5);
    setPin(newPin);
    let newData = {
      pinNumber: newPin,
    };
    if (user) {
      await updateUser(user.userID, newData);
    }
  };

  return user && house ? (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={editing}
        onClose={handleClose}
        className={styles.dialog}
      >
        <DialogContent>
          <div className={styles.shiftBox}>
            <div className={styles.body}>
              <Typography className={styles.bodyTitle} variant="h5">
                Name
              </Typography>
              <TextField
                className={styles.textfield}
                fullWidth
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
              <Typography className={styles.bodyTitle} variant="h5">
                Email
              </Typography>
              <TextField
                className={styles.textfield}
                fullWidth
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
              <Typography className={styles.bodyTitle} variant="h5">
                Password
              </Typography>
              <TextField
                disabled
                className={styles.textfield}
                fullWidth
                value={star.repeat(10)}
                onChange={(event) => {}}
              />
              <Typography className={styles.bodyTitle} variant="h5">
                Pin Code
              </Typography>
              <div className={styles.flex}>
                <TextField
                  disabled
                  className={styles.textfield}
                  fullWidth
                  value={pin}
                  onChange={(event) => {}}
                />
                <Button onClick={resetPin}>Reset</Button>
              </div>
            </div>
            <hr className={styles.line} />
            <div className={styles.save}>
              <Button onClick={handleClose} variant="contained">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardContent className={styles.card}>
          <div className={styles.body}>
            <Typography className={styles.bodyTitle} variant="h5">
              Name
            </Typography>
            <TextField
              disabled
              className={styles.textfield}
              fullWidth
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <Typography className={styles.bodyTitle} variant="h5">
              Email
            </Typography>
            <TextField
              disabled
              className={styles.textfield}
              fullWidth
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Typography className={styles.bodyTitle} variant="h5">
              Password
            </Typography>
            <TextField
              disabled
              className={styles.textfield}
              fullWidth
              value={star.repeat(10)}
              onChange={(event) => {}}
            />
            <Typography className={styles.bodyTitle} variant="h5">
              Pin Code
            </Typography>
            <TextField
              disabled
              className={styles.textfield}
              fullWidth
              value={pin}
              onChange={(event) => {}}
            />
          </div>
          <hr className={styles.line} />
          <div className={styles.save}>
            <Button onClick={handleOpen} variant="contained">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div></div>
  );
};

export default SettingsInfo;
