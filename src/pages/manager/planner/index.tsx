import Head from "next/head";
import Layout from "../../../components/Layout/Layout";
import ShiftCard from "../../../components/ManagerComponents/Shiftcard/Shiftcard";
import UnassignedShiftList from "../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList";

export default function PlannerPage() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Workshift App</title>
          <meta name="description" content="Next.js firebase Workshift app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>This is the planner page.</p>
        <main>
          <ShiftCard />
          <UnassignedShiftList />
        </main>
        <footer>
        </footer>
      </div>
    </Layout>
  );
}
