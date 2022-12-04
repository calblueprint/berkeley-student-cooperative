import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Icon from "../../../assets/Icon";
import { getShift } from "../../../firebase/queries/shift";
import { Shift } from "../../../types/schema";
import ShiftAssignmentComponentCard from "../AssignShiftTable/ShiftAssigmentTableUsers";
import styles from "./AssignShiftcard.module.css";

type AssignShiftcardProps = {
  day: string;
  shiftID: string;
  houseID: string;
  open: boolean;
  handleClose: any;
  handleOpen: any;
};

const AssignShiftcard: React.FC<AssignShiftcardProps> = ({
  day,
  shiftID,
  houseID,
  open,
  handleClose,
  handleOpen,
}: AssignShiftcardProps) => {
  const [shift, setShift] = useState<Shift | null>();

  useEffect(() => {
    const getShiftFB = async () => {
      const currShift = await getShift(houseID, shiftID);
      setShift(currShift);
    };
    getShiftFB();
  }, [houseID, shiftID]);

  const parseHour = (timeWindow: number) => {
    if (timeWindow == 1200 || timeWindow == 0) {
      return 12;
    } else if (timeWindow >= 1000) {
      return Math.floor(timeWindow / 100) % 12;
    } else return Math.floor(timeWindow / 10) % 12;
  };

  const parseMinute = (timeWindow: number) => {
    if (timeWindow % 100 == 0) {
      return "00";
    }
    return timeWindow % 100;
  };

  const parseAM = (timeWindow: number) => {
    return timeWindow >= 1200 ? "PM" : "AM";
  };

  return shift ? (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className={styles.dialog}
      >
        <DialogContent>
          <div className={styles.assignShiftBox}>
            <div className={styles.header}>
              <Typography variant="h4">
                {shift.name.slice(0, 1).toUpperCase()}
                {shift.name.slice(1)}
              </Typography>
              <Button onClick={handleClose} className={styles.close}>
                <Icon type={"close"} />
              </Button>
            </div>
            <div className={styles.assignShiftInfo}>
              <Typography className={styles.infoForShift} variant="body1">
                +{shift.hours} {shift.hours < 2 ? "hour" : "hours"}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.possibleDays.join(", ")}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {parseHour(shift.timeWindow[0])}
                {":"}
                {parseMinute(shift.timeWindow[0])}
                {parseAM(shift.timeWindow[0])}
                {" - "}
                {parseHour(shift.timeWindow[1])}
                {":"}
                {parseMinute(shift.timeWindow[1])}
                {parseAM(shift.timeWindow[1])}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.verificationBuffer} hour buffer
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.numOfPeople}{" "}
                {shift.numOfPeople < 2 ? "member" : "members"}
              </Typography>
            </div>
            <ShiftAssignmentComponentCard
              day={day}
              houseID={houseID}
              shiftID={shiftID}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div />
  );
};

export default AssignShiftcard;
