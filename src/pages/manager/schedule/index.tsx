import Layout from "../../../components/Layout/Layout";
import ShiftSchedule from "../../../components/ManagerComponents/shiftSchedule/ShiftSchedule";
import UnassignedShiftList from "../../../components/ManagerComponents/UnassignedShiftList/unassignedShiftList";

export default function SchedulePage() {
  return (
    <Layout>
      <p>This is the schedule page.</p>
      <UnassignedShiftList />
    </Layout>
  );
}
