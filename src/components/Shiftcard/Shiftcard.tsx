import { useState } from "react";
import * as React from "react";
import styles from "./ShiftCard.module.css";
import {
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { addShift } from "../../firebase/queries/shift";
import Icon from "../../assets/Icon";

const ShiftCard = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [members, setMembers] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(12);
  const [startAM, setStartAM] = useState<string>("AM");
  const [endTime, setEndTime] = useState<number>(12);
  const [endAM, setEndAM] = useState<string>("AM");
  const [buffer, setBuffer] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [possibleDays, setPossibleDays] = useState<string[]>([]);
  const [verification, setVerification] = useState<boolean>(false);

  let shiftCategories = [
    "cook dinner",
    "clean bathroom",
    "wash dishes",
    "clean basement",
  ];
  let hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let verificationOptions = ["Verification required", "No verification"];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (
      name &&
      description &&
      isValidNumber(members) &&
      possibleDays &&
      startTime &&
      endTime &&
      isValidNumber(hours) &&
      isValidNumber(buffer) &&
      category
    ) {
      await addShift(
        "EUC",
        name,
        description,
        members,
        possibleDays,
        [parseTime(startTime, startAM), parseTime(endTime, endAM)],
        "",
        hours,
        verification,
        buffer,
        category
      );
      clearFields();
      handleClose();
    }
    // error fields on submit?
  };

  const clearFields = () => {
    setName("");
    setCategory("");
    setMembers(0);
    setHours(0);
    setStartTime(12);
    setStartAM("AM");
    setEndTime(12);
    setEndAM("AM");
    setBuffer(0);
    setDescription("");
    setPossibleDays([]);
    setVerification(false);
  };

  const closeDialog = () => {
    clearFields();
    handleClose();
  };

  const handlePossibleDays = (event: SelectChangeEvent<string>) => {
    let input = event.target.value;
    setPossibleDays(typeof input === "string" ? input.split(",") : input);
  };

  const handleMembers = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    let parsed = parseInt(input);
    if (input.length == 0 || !isNaN(parsed)) {
      setMembers(parsed);
    }
  };

  const handleHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    let parsed = parseInt(input);
    if (input.length == 0 || !isNaN(parsed)) {
      setHours(parsed);
    }
  };

  const handleBuffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    let parsed = parseInt(input);
    if (input.length == 0 || !isNaN(parsed)) {
      setBuffer(parsed);
    }
  };

  const handleVerification = (event: SelectChangeEvent<string>) => {
    let input = event.target.value;
    if (input == "Verification required") {
      setVerification(true);
    }
    if (input == "No verification") {
      setVerification(false);
    }
  };

  const isValidNumber = (input: number) => {
    return input > 0 && !isNaN(input);
  };

  const parseTime = (hour: number, AM: string) => {
    return AM == "AM" ? hour : hour + 12;
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        <Typography>Add Shift</Typography>
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className={styles.dialog}
      >
        <DialogContent>
          <div className={styles.shiftBox}>
            <div className={styles.header}>
              <div className={styles.flex}>
                <Typography className={styles.title} variant="h4">
                  Create Shift
                </Typography>
                <Button onClick={closeDialog} className={styles.close}>
                  <Icon type={"close"} />
                </Button>
              </div>
              <hr />
            </div>
            <div className={styles.formField}>
              <div>
                <Typography>Shift name</Typography>
              </div>

              <TextField
                className={styles.textfield}
                fullWidth
                value={name}
                placeholder="Ex: Basement clean"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div className={styles.formField}>
              <Typography>Task category</Typography>
              <Select
                fullWidth
                placeholder="Ex: basement"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                {shiftCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={styles.flex}>
              <div className={styles.formField}>
                <Typography>Members required</Typography>
                <TextField
                  fullWidth
                  placeholder="0"
                  value={members ? members : ""}
                  onChange={handleMembers}
                />
              </div>
              <div className={styles.formField}>
                <Typography>Hours worth</Typography>
                <TextField
                  fullWidth
                  placeholder="0"
                  value={hours ? hours : ""}
                  onChange={handleHours}
                />
              </div>
            </div>
            <div className={styles.formField}>
              <Typography>Day (select as many as applicable)</Typography>
              <Select
                fullWidth
                placeholder="Undated"
                multiple
                value={possibleDays as unknown as string}
                onChange={handlePossibleDays}
              >
                {daysList.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={styles.flex}>
              <div className={styles.formField}>
                <Typography>Start time</Typography>
                <Select
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value as number);
                  }}
                >
                  {hoursList.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={startAM}
                  onChange={(event) => {
                    setStartAM(event.target.value);
                  }}
                >
                  <MenuItem key={"AM"} value={"AM"}>
                    AM
                  </MenuItem>
                  <MenuItem key={"PM"} value={"PM"}>
                    PM
                  </MenuItem>
                </Select>
              </div>
              <div className={styles.formField}>
                <Typography>End time</Typography>
                <Select
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value as number);
                  }}
                >
                  {hoursList.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={endAM}
                  onChange={(event) => {
                    setEndAM(event.target.value);
                  }}
                >
                  <MenuItem key={"AM"} value={"AM"}>
                    AM
                  </MenuItem>
                  <MenuItem key={"PM"} value={"PM"}>
                    PM
                  </MenuItem>
                </Select>
              </div>
              <div className={styles.formField}>
                <Typography>Buffer hours</Typography>
                <TextField
                  fullWidth
                  placeholder="0"
                  value={buffer ? buffer : ""}
                  onChange={handleBuffer}
                />
              </div>
            </div>
            <div className={styles.formField}>
              <Typography>Verification</Typography>
              <Select
                fullWidth
                placeholder="No verification"
                value={
                  verification ? "Verification required" : "No verification"
                }
                onChange={handleVerification}
              >
                {verificationOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={styles.formField}>
              <Typography>Description</Typography>
              <TextField
                fullWidth
                placeholder="Type instructions for this shift..."
                multiline
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </div>
            <div>
              <Button onClick={handleSubmit} className={styles.submit}>
                Create shift
              </Button>
              <Button onClick={clearFields} className={styles.clear}>
                Clear all
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftCard;
