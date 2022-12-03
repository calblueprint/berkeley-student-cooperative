import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useFirebaseAuth } from "../firebase/queries/auth";
import ViewShiftcard from "../components/MemberComponents/ViewShiftcard/ViewShiftcard";
import { firestoreAutoId } from "../firebase/helpers";

const Home: NextPage = () => {
  const router = useRouter();
  const { authUser } = useFirebaseAuth();

  useEffect(() => {
    if (authUser.userID == "") {
      router.push("/login");
    }
  });

  return (<div/>)
};

export default Home;