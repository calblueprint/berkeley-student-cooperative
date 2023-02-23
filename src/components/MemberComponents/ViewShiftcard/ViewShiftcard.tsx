import {
  Button,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import Icon from '../../../assets/Icon'
import { useUserContext } from '../../../context/UserContext'
import { parseTime } from '../../../firebase/helpers'
import { getHouse } from '../../../firebase/queries/house'
import {
  getShift,
  getVerifiedShifts,
  verifyShift,
} from '../../../firebase/queries/shift'
import { getUser } from '../../../firebase/queries/user'
import { Shift, User, VerifiedShift } from '../../../types/schema'
import styles from './ViewShiftcard.module.css'

type ViewShiftcardProps = {
  shiftID: string
  houseID: string
  open: boolean
  handleClose: any
  handleOpen: any
}

/**
 * IMPORTANT:  When this component is integrated to table, must move open, setOpen, handleOpen, and handleClose to the table rather than the card itself.
 * TODO:
 * Verify button only pops up if current user isn't verified for this shift[x]
 * Make table into Data Table []
 * Update shift info representation to match Updated Designs []
\ * apply changes to AssignShiftCard []
 * apply changes to shiftSchedule (check that it's pulled) []
 * styling []
 * When attaching to a schedule:  move shiftID and houseID up, as well as pinUser map. []
 * @remarks
 * When integrated with the member view table, will give shift properties
 * Table will display other members participating in task.
 * Verify field will allow another member to verify this user with a PIN
 * 
 * @param shiftID - ID of Shift in Firebase
 * @param houseID - ID of House in Firebase
**/

const ViewShiftcard: React.FC<ViewShiftcardProps> = ({
  shiftID,
  houseID,
  open,
  handleClose,
  handleOpen,
}: ViewShiftcardProps) => {
  const { authUser, house } = useUserContext()
  const [shift, setShift] = useState<Shift | null>()
  const [memberRows, setMemberRows] = useState<JSX.Element[]>()
  const [verifierPin, setVerifierPin] = useState('')
  const [userPinMap, setUserPinMap] = useState(new Map<string, string>())
  const [isMemVerified, setMemVerified] = useState(false)

  /**
   * @remarks
   * Flow:
   * Get the current shift from FB, call loadMemberRows to load in rows based on members assigned.
   * Use uids to find members assigned to shift, compare this to the verifiedShifts list to see if complete,incomplete, or missing
   * Load in the userPinMap to do the check for each member.
   * Verifying shift runs a check to assure that the verification is possible, if so, object is added to that collection.
   **/
  useEffect(() => {
    const today = new Date()
    const getShiftFB = async () => {
      if (shiftID != '') {
        // greg: added this check for an empty shiftID cuz the default state in the MemberShiftView is an empty string
        const currShift = await getShift(houseID, shiftID)
        if (currShift != null) {
          setShift(currShift)
          await loadMemberRows(currShift.usersAssigned) //Use currShift, instead of shift because of useState delay.
        }
      }
    }
    getShiftFB()
  }, [shiftID]) // greg: added this so that the modal grabbed the correct shift info based on the changing currentShiftCard value in MemberShiftView component

  /**
   * @remarks
   * Populates the table that displays the Members assigned to task
   * Also checks if member has been verified for this shift
   * Accesses all pins associated with house, to make sure a valid PIN is used to verify.
   * @param usersAssigned - IDs of members assigned to this Shift
   */
  const loadMemberRows = async (usersAssigned: string[]) => {
    console.log({ authUser: authUser })
    let userObjects = await getAssignedUsers(usersAssigned)
    let tempMemRows = new Array<JSX.Element>()
    let verShifts = await getVerifiedShifts(houseID, shiftID)
    let house = await getHouse(houseID)
    setUserPinMap(house.userPINs)
    //Uses list of Users to generate the member rows in table
    userObjects.map((user) => {
      if (user != null) {
        tempMemRows.push(generateMemRow(user, verShifts))
      }
    })
    setMemberRows(tempMemRows)
  }

  /**
   * @remarks
   * Helper func for loadMemberRows, retrieves assigned users for shift
   * @param usersAssigned - IDs of members assigned to this Shift
   * @returns - List of Users assigned to shift
   */
  const getAssignedUsers = async (usersAssigned: string[]) => {
    let promises: Promise<User | null>[] = []
    usersAssigned.map((userID) => {
      promises.push(getUser(userID))
    })
    let userObjects = await Promise.all(promises)
    return userObjects
  }

  /**
   * @TODO
   * Modal loads weirdly: loads with previous states from previously selected shift,
   * then does logic for currently selected shift, and then loads the correct stuff.
   * What we should be doing is the logic first, and then filling out the components
   * with the correct information.
   *
   * @remarks
   * Takes a User Object and creates a JSX table row to represent it
   * Checks with verifiedShifts to see if Shift was completed by a User
   * PENDING:  Needs to be abe to display "me" for signed-in user
   * @param user - Assigned User Object
   * @param verShifts - List of VerifiedShifts
   * @returns
   */
  const generateMemRow = (
    user: User,
    verShifts: Map<string, VerifiedShift>
  ) => {
    let status = 'Incomplete'
    let time = ''
    let verifiedShift = verShifts.get(user.userID)
    let username = user.firstName + ' ' + user.lastName
    let authname = authUser.firstName + ' ' + authUser.lastName
    let name = username != authname ? username : 'me' //If member row is the current user, display name as 'me'
    console.log('Member: ', username, ' | VerifiedShift: ', verifiedShift)
    if (verifiedShift != undefined) {
      status = 'Complete'
      time = verifiedShift.timeStamp
      if (!isMemVerified && verifiedShift.shifterID == authUser.userID) {
        setMemVerified(true) //IF current member is already verified, this useState will disable the verification button
      }
    } else {
      setMemVerified(false) // greg: had to add this here because when modal loaded for a shift that was verified, isVerified never got updated back to false for future modals
    }
    console.log('Is mem verified?: ', isMemVerified)
    return (
      <TableRow key={user.userID} className={styles.tableRow}>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">{time}</TableCell>
        <TableCell align="right">{status}</TableCell>
      </TableRow>
    )
  }

  /**
   * @remarks
   * handle open and close handle if the modal is on the screen.  When integrating this component to table, need to move these
   * functions and the useState to the table.
   **/
  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  /**
   * @remarks
   * Check that a verifying PIN isn't the current user's and that it exists in this House.
   * If so, verifyShift is called which creates a verifyShift object in the firebase.
   */
  const handleVerify = () => {
    let verifierID = userPinMap.get(verifierPin)
    console.log({ userPinMap, verifierPin })
    if (verifierID == undefined) {
      //Replace with modal/warning
      console.log('Invalid PIN')
    } else if (verifierID == authUser.userID) {
      console.log("Can't verify self!")
    } else {
      verifyShift(verifierID, authUser.userID, shiftID, houseID)
    }
  }

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
                <Icon type={'close'} />
              </Button>
            </div>
            <div className={styles.assignShiftInfo}>
              <Typography className={styles.infoForShift} variant="body1">
                +{shift.hours} {shift.hours < 2 ? 'hour' : 'hours'}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.possibleDays.join(', ')}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {parseTime(shift.timeWindow[0])}
                {' - '}
                {parseTime(shift.timeWindow[1])}
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.verificationBuffer} hour buffer
              </Typography>
              <Typography className={styles.infoForShift} variant="body1">
                {shift.numOfPeople}{' '}
                {shift.numOfPeople < 2 ? 'member' : 'members'}
              </Typography>
            </div>
            <div className={styles.assignedMembersTable}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Available</TableCell>
                      <TableCell align="right">Timestamp</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{memberRows}</TableBody>
                </Table>
              </TableContainer>
              {!isMemVerified ? (
                <div>
                  <div className={styles.verificationHeader}>
                    <Typography variant="h6">Pin code</Typography>
                    <TextField
                      sx={{ minWidth: 560 }}
                      inputProps={{ maxLength: 5 }}
                      id="outlined-password-input"
                      label="Enter your pin code"
                      type="password"
                      autoComplete="current-password"
                      onChange={(ev) => {
                        setVerifierPin(ev.target.value)
                      }}
                    />
                  </div>
                  <div className={styles.verifyButton}>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleVerify()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div />
  )
}

export default ViewShiftcard
