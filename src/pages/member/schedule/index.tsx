import React from "react";
import Layout from "../../../components/Layout/Layout";
import { MemberScheduleHeader } from "../../../components/MemberComponents/MemberSchedule/MemberScheduleHeader/MemberScheduleHeader";
import { MemberShiftSchedule } from "../../../components/MemberComponents/MemberSchedule/MemberShiftSchedule/MemberShiftView";
import { useUserContext } from "../../../context/UserContext";
import { House, User } from "../../../types/schema";
import styles from "./MemberSchedule.module.css";

type MemberSchedulePageProps = {
  user?: User;
  house?: House;
};

const MemberSchedulePage: React.FC<MemberSchedulePageProps> = ({
  user,
  house,
}) => {
  const { authUser, signIn, signOutAuth, register } = useUserContext();

  return (
    <Layout>
      <MemberScheduleHeader />
      <MemberShiftSchedule user={authUser} />
    </Layout>
  );
};

export default MemberSchedulePage;
