import { Card, CardContent, Typography } from "@mui/material";
import router from "next/router";
import { useState, useEffect } from "react";
import { getUser } from "../../../firebase/queries/user";
import { User } from "../../../types/schema";
import styles from "../SettingsInfo/SettingsInfo.module.css";

type TaskPreferenceInfoProps = {
  userID: string;
};

const TaskPreferenceInfo: React.FC<TaskPreferenceInfoProps> = ({
  userID,
}: TaskPreferenceInfoProps) => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const getData = async () => {
      const currUser = await getUser(userID);
      setUser(currUser);
    };
    getData();
  }, [userID]);

  return user ? (
    <Card sx={{ width: 550, height: 360 }}>
      <CardContent className={styles.card}>
        <div className={styles.flex}>
          <Typography variant="h5">Task Preferences</Typography>
        </div>
        <hr className={styles.line} />
        <div className={styles.body}>
          <button onClick={() => {
          router.push("/member/preferences/memberPreferences");
        }}>Fill Out Preferences</button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div></div>
  );
};

export default TaskPreferenceInfo;
