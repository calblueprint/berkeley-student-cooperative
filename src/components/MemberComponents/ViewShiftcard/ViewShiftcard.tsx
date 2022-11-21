import { Button, Dialog, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Icon from "../../../assets/Icon";
import { useUserContext } from "../../../context/UserContext";
import { objectToMap, parseTime } from "../../../firebase/helpers";
import { getHouse } from "../../../firebase/queries/house";
import { getShift, getVerifiedShifts, verifyShift } from "../../../firebase/queries/shift";
import { getUser } from "../../../firebase/queries/user";
import { Shift, User, VerifiedShift } from "../../../types/schema";
import styles from "./ViewShiftcard.module.css";

type ViewShiftcardProps = {
  shiftID: string;
  houseID: string;
};

/* 
IMPORTANT:  When this component is integrated to table, must move open, setOpen, handleOpen, and handleClose to the table rather than the card itself.
TODO:
 - Plug in userContext [x]
 - Query to get VerifiedShifts [x]
 - Create a check with verified shifts & status [x]
 - check current user vs assigned members [x]
 - revamp parse time for AssignShiftCard, shiftSchedule, and ViewShiftcard [x]
 - need persistence to work in UserContext or userAuth []
 - Connect verify to Firebase [x]
 - apply changes to AssignShiftCard []
 - apply changes to shiftSchedule (check that it's pulled) []
 - styling []
 - When attaching to a schedule:  move shiftID and houseID up, as well as pinUser map. []
*/

const ViewShiftcard: React.FC<ViewShiftcardProps> = ({
  shiftID,
  houseID,
}: ViewShiftcardProps) => {

  const { authUser, house } = useUserContext();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<Shift | null>();
  const [memberRows, setMemberRows] = useState<JSX.Element[]>();
  const [verifiedShifts, setVerifiedShifts] = useState(new Map<string, VerifiedShift>);
  const [user, setUser] = useState();
  const [verifierPin, setVerifierPin] = useState("");
  const [userPinMap, setUserPinMap] = useState(new Map<string, string>());

  /*
   * Flow:
   * Get the current shift from FB, call loadMemberRows to load in rows based on members assigned.
   * Use uids to find members assigned to shift, compare this to the verifiedShifts list to see if complete,incomplete, or missing
   * Load in the userPinMap to do the check for each member.  
   * Verifying shift runs a check to assure that the verification is possible, if so, object is added to that collection.
   */
  useEffect(() => {
    const today = new Date();
    const getShiftFB = async () => {
      const currShift = await getShift(houseID, shiftID);
      if (currShift != null) {
        setShift(currShift);
        loadMemberRows(currShift.usersAssigned) //Use currShift, instead of shift because of useState delay.
      }
    };
    getShiftFB();
  }, []);

  const loadMemberRows = async (usersAssigned: string[]) => {
    let userObjects = await getAssignedUsers(usersAssigned);
    let tempMemRows = new Array<JSX.Element>();
    let verShifts = await getVerifiedShifts(houseID, shiftID);
    let house = await getHouse(houseID);
    setUserPinMap(objectToMap(house.userPINs));
    setVerifiedShifts(verShifts);
    userObjects.map((user) => {
      if (user != null) {
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
    let status = "Incomplete";
    let time = "";
    let verifiedShift = verShifts.get(user.userID);
    //changing user to "me" is iffy, persistence needs to work first due to loading order.
    //component is loaded in before authUser is signed in, persistence fixes this.
    let name = user.name != authUser.name ? user.name : "me"
    if (verifiedShift != undefined) {
      status = "Complete";
      time = verifiedShift.timeStamp;
    }
    return ( 
      <TableRow
         key={user.userID}
         className = {styles.tableRow}
         >
          <TableCell component="th" scope="row">{name}</TableCell>
          <TableCell align="right">{time}</TableCell>
          <TableCell align="right">{status}</TableCell>
      </TableRow>
    )
  }

  /*
  * handle open and close handle if the modal is on the screen.  When integrating this component to table, need to move these 
  * functions and the useState to the table.
   */
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  /*
   * Check that a verifying PIN isn't the current user's and that it exists in this House.
   * If so, verifyShift is called which creates a verifyShift object in the firebase.
   */

  const handleVerify = () => {
    let verifierID = userPinMap.get(verifierPin);
    if (verifierID == undefined) {
      //Replace with modal/warning
      console.log("Invalid PIN");
    } else if (verifierID == authUser.userID) {
      console.log("Can't verify self!");
    } else {
      verifyShift(verifierID, authUser.userID, shiftID, houseID);
    }
  }

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
                inputProps ={{ maxLength: 5}}
                id="outlined-password-input"
                label="Enter your pin code"
                type="password"
                autoComplete="current-password"
                onChange={(ev) => {
                  setVerifierPin(ev.target.value);
                }}
              />
            </div>
              <div className = {styles.verifyButton}>
                <Button
                 variant="contained"
                 size="medium"
                 onClick={() => 
                  handleVerify()
                }
                 >
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
