import { Typography } from "@mui/material";
import Layout from "../../../components/Layout/Layout";
import AvailabilityInfo from "../../../components/MemberComponents/AvailabilityInfo/AvailabilityInfo";
import DocumentsInfo from "../../../components/MemberComponents/DocumentsInfo/DocumentsInfo";
import SettingsInfo from "../../../components/MemberComponents/SettingsInfo/SettingsInfo";
import TaskPreferenceInfo from "../../../components/MemberComponents/TaskPreferenceInfo/TaskPreferenceInfo";
import { useUserContext } from "../../../context/UserContext";
import styles from "./Settings.module.css";

export default function SettingsPage() {
  /**
   * Displays 4 cards of information for the settings page - avaiailability, task preferences, personal information, documents
   */

  const { authUser } = useUserContext();

  return (
    <Layout>
      <Typography variant="h4">Settings</Typography>
      <div className={styles.row}>
        <AvailabilityInfo userID={authUser.userID} />
        <div className={styles.rightCard}>
          <TaskPreferenceInfo userID={authUser.userID} />
        </div>
      </div>
      <div className={styles.row}>
        <SettingsInfo userID={authUser.userID} />
        <div className={styles.rightCard}>
          <DocumentsInfo userID={authUser.userID} />
        </div>
      </div>
    </Layout>
  );
}
