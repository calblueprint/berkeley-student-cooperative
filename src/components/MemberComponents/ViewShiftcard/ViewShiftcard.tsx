import { Button, Dialog, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Icon from "../../../assets/Icon";
import { useUserContext } from "../../../context/UserContext";
import { parseTime } from "../../../firebase/helpers";
import { getShift, getVerifiedShifts } from "../../../firebase/queries/shift";
import { getUser } from "../../../firebase/queries/user";
import { Shift, User, VerifiedShift } from "../../../types/schema";
import styles from "./ViewShiftcard.module.css";

type ViewShiftcardProps = {
  shiftID: string;
  houseID: string;
};

/* 
TODO:
 - Plug in userContext [x]
 - Query to get VerifiedShifts [x]
 - Create a check with verified shifts & status [x]
 - check current user vs assigned members [x]
 - revamp parse time for AssignShiftCard, shiftSchedule, and ViewShiftcard [x]
 - apply changes to AssignShiftCard []
 - apply changes to shiftSchedule (check that it's pulled) [ ]
 - styling []
*/

const ViewShiftcard: React.FC<ViewShiftcardProps> = ({
  shiftID,
  houseID,
}: ViewShiftcardProps) => {

  const { authUser, house } = useUserContext();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<Shift | null>();
  const [memberRows, setMemberRows] = useState<JSX.Element[]>();
  const [verifiedShifts, setVerifiedShifts] = useState(new Map<string, VerifiedShift>)

  useEffect(() => {
    const today = new Date();
    const getShiftFB = async () => {
      console.log({authUser: authUser, house: house});
      const currShift = await getShift(houseID, shiftID);
      if (currShift != null) {
        setShift(currShift);
        // let verShifts = await getVerifiedShifts(houseID, shiftID);
        // setVerifiedShifts(verShifts);
        loadMemberRows(currShift.usersAssigned) //Use currShift, instead of shift because of useState delay.
      }
    };
    getShiftFB();
  }, [houseID, shiftID]);

  const loadMemberRows = async (usersAssigned: string[]) => {
    let userObjects = await getAssignedUsers(usersAssigned);
    let tempMemRows = new Array<JSX.Element>();
    let verShifts = await getVerifiedShifts(houseID, shiftID);
    setVerifiedShifts(verShifts);
    userObjects.map((user) => {
      if (user != null) {
        console.log({user: user});
        tempMemRows.push(generateMemRow(user, verShifts));
      }
    })
    setMemberRows(tempMemRows);
  }

  const getAssignedUsers = async (usersAssigned: string[]) => {
    let promises: Promise<User | null>[] = [];
    usersAssigned.map((userID) => {
      promises.push(getUser(userID));
    })
    let userObjects = await Promise.all(promises);
    return userObjects;
  }

  const generateMemRow = (user: User, verShifts: Map<string, VerifiedShift>) => {
    //calculate status
    let status = "Incomplete";
    //calculate time
    let time = " ";
    console.log({verShifts: verShifts});
    let verifiedShift = verShifts.get(user.userID);
    if (verifiedShift != undefined) {
      status = "Complete";
      time = parseTime(Number(verifiedShift.timeStamp));
    }
    return ( 
      <TableRow
         key={user.userID}
         className = {styles.tableRow}
         >
          <TableCell component="th" scope="row">{user.name}</TableCell>
          <TableCell align="right">{time}</TableCell>
          <TableCell align="right">{status}</TableCell>
      </TableRow>
    )
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return shift ? (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        <Typography>View Shift</Typography>
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
                {parseTime(shift.timeWindow[0])}
                {" - "}
                {parseTime(shift.timeWindow[1])}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.verificationBuffer} hour buffer
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.numOfPeople}{" "}
                {shift.numOfPeople < 2 ? "member" : "members"}
              </Typography>
            </div>
            <div className = {styles.assignedMembersTable}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell align="right">Time</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberRows}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className = {styles.verificationHeader}>
              <Typography variant="h6">
                Verification
              </Typography>
              <TextField
                sx = {{ minWidth: 560}}
                id="outlined-password-input"
                label="Enter your pin code"
                type="password"
                autoComplete="current-password"
              />
            </div>
              <div className = {styles.verifyButton}>
                <Button
                 variant="contained"
                 size="medium">
                  Verify shift
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div />
  );
};

export default ViewShiftcard;
