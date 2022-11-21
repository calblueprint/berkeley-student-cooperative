import { Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getUser } from "../../../firebase/queries/user";
import { User } from "../../../types/schema";
import styles from "../SettingsInfo/SettingsInfo.module.css";

type DocumentsInfoProps = {
  userID: string;
};

const DocumentsInfo: React.FC<DocumentsInfoProps> = ({
  userID,
}: DocumentsInfoProps) => {
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
          <Typography variant="h5">Documents</Typography>
          {/* <Typography variant="caption" className={styles.updated}>
            Last updated 3 minutes ago
          </Typography> */}
        </div>
        <hr className={styles.line} />
        <div className={styles.body}></div>
      </CardContent>
    </Card>
  ) : (
    <div></div>
  );
};

export default DocumentsInfo;
