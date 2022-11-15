import { Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getHouse } from "../../../firebase/queries/house";
import { getUser } from "../../../firebase/queries/user";
import { House, User } from "../../../types/schema";
import styles from "./SettingsInfo.module.css";

type SettingsInfoProps = {
  userID: string;
};

const SettingsInfo: React.FC<SettingsInfoProps> = ({
  userID,
}: SettingsInfoProps) => {
  const [user, setUser] = useState<User | null>();
  const [house, setHouse] = useState<House | null>();
  let star = "*";

  useEffect(() => {
    const getData = async () => {
      const currUser = await getUser(userID);
      setUser(currUser);
    };
    getData();
  }, [userID]);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const currHouse = await getHouse(user.houseID);
        setHouse(currHouse);
      }
    };
    getData();
  }, [user]);

  return user && house ? (
    <Card sx={{ width: 550, height: 360 }}>
      <CardContent className={styles.card}>
        <div className={styles.flex}>
          <Typography variant="h5">Information</Typography>
          {/* <Typography variant="caption" className={styles.updated}>
            Last updated 3 minutes ago
          </Typography> */}
        </div>
        <hr className={styles.line} />
        <div className={styles.body}>
          <Typography className={styles.bodyText} variant="subtitle2">
            {user.name}
          </Typography>
          <Typography className={styles.bodyText}>{user.email}</Typography>
          <Typography className={styles.bodyText}>{house.address}</Typography>
          <Typography className={styles.bodyText}>
            {"Pin: "}
            {user.pinNumber}
          </Typography>
          <Typography className={styles.bodyText}>{star.repeat(10)}</Typography>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div></div>
  );
};

export default SettingsInfo;
