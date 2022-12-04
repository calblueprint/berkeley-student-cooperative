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
import { addShift } from "../../../firebase/queries/shift";
import Icon from "../../../assets/Icon";

const ShiftCard = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [members, setMembers] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [startHour, setStartHour] = useState<number>(12);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [startAM, setStartAM] = useState<string>("AM");
  const [endHour, setEndHour] = useState<number>(12);
  const [endMinute, setEndMinute] = useState<number>(0);
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
      possibleDays.length > 0 &&
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
        [
          parseTime(startHour, startMinute, startAM),
          parseTime(endHour, endMinute, endAM),
        ],
        "",
        hours,
        verification,
        buffer,
        category
      );
      clearFields();
      handleClose();
    } else {
      console.log("Must fill out all the fields to create a shift.");
    }
  };

  const clearFields = () => {
    setName("");
    setCategory("");
    setMembers(0);
    setHours(0);
    setStartHour(12);
    setStartMinute(0);
    setStartAM("AM");
    setEndHour(12);
    setEndMinute(0);
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

  const parseTime = (hour: number, minute: number, AM: string) => {
    return AM == "AM" ? hour * 100 + minute : (hour + 12) * 100 + minute;
  };

  return (
    <div>
      <div className={styles.button}>
        <Button variant="contained" onClick={handleOpen}>
        <Typography>New shift +</Typography>
      </Button>
      </div>
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
                  value={startHour}
                  onChange={(event) => {
                    setStartHour(event.target.value as number);
                  }}
                >
                  {hoursList.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={startMinute}
                  onChange={(event) => {
                    setStartMinute(event.target.value as number);
                  }}
                >
                  <MenuItem key={0} value={0}>
                    00
                  </MenuItem>
                  <MenuItem key={30} value={30}>
                    30
                  </MenuItem>
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
                  value={endHour}
                  onChange={(event) => {
                    setEndHour(event.target.value as number);
                  }}
                >
                  {hoursList.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={endMinute}
                  onChange={(event) => {
                    setEndMinute(event.target.value as number);
                  }}
                >
                  <MenuItem key={0} value={0}>
                    00
                  </MenuItem>
                  <MenuItem key={30} value={30}>
                    30
                  </MenuItem>
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
