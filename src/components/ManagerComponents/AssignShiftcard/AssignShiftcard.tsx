import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Icon from "../../../assets/Icon";
import { getShift } from "../../../firebase/queries/shift";
import { Shift } from "../../../types/schema";
import styles from "./AssignShiftcard.module.css";

type AssignShiftcardProps = {
  shiftID: string;
  houseID: string;
};

const AssignShiftcard: React.FC<AssignShiftcardProps> = ({
  shiftID,
  houseID,
}: AssignShiftcardProps) => {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<Shift | null>();


  useEffect(() => {
    const getShiftFB = async () => {
      const currShift = await getShift(houseID, shiftID);
      setShift(currShift);
    };
    getShiftFB();
  }, [houseID, shiftID]);

  const parseHour = (timeWindow: number) => {
    if (timeWindow > 12) {
      return timeWindow - 12;
    }
    return timeWindow;
  };
  const parseAM = (timeWindow: number) => {
    return timeWindow > 12 ? "PM" : "AM";
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return shift ? (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        <Typography>Assign Shift</Typography>
      </Button>
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
                {parseHour(shift.timeWindow[0]) + parseAM(shift.timeWindow[0])}{" "}
                -{" "}
                {parseHour(shift.timeWindow[1]) + parseAM(shift.timeWindow[1])}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.verificationBuffer} hour buffer
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.numOfPeople}{" "}
                {shift.numOfPeople < 2 ? "member" : "members"}
              </Typography>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div />
  );
};

export default AssignShiftcard;
