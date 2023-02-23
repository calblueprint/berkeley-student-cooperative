import { useState } from 'react'
import * as React from 'react'
import styles from './ShiftCard.module.css'
import {
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { addShift } from '../../../firebase/queries/shift'
import Icon from '../../../assets/Icon'
import { House } from '../../../types/schema'

type ShiftCardProps = {
  house: House
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  house,
}: ShiftCardProps) => {
  /**
   * Returns a component for managers to create shifts
   *
   * form fields - name, shift category, number of members, number of hours, start time, end time, buffer period, description, possible days for the shift, verification or no verification
   *
   * (dialog is the pop-up screen that contains the create shift form)
   */
  // const [house, setHouse] = useState<House>()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [hours, setHours] = useState<number>(0)
  const [startHour, setStartHour] = useState<number>(12)
  const [startMinute, setStartMinute] = useState<number>(0)
  const [startAM, setStartAM] = useState<string>('AM')
  const [endHour, setEndHour] = useState<number>(12)
  const [endMinute, setEndMinute] = useState<number>(0)
  const [endAM, setEndAM] = useState<string>('AM')
  const [buffer, setBuffer] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [possibleDays, setPossibleDays] = useState<string[]>([])
  const [verification, setVerification] = useState<boolean>(false)

  const hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const daysList = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  const verificationOptions = ['Verification required', 'No verification']

  const handleOpen = () => {
    // sets the variable "open" to true to open the dialog
    setOpen(true)
  }

  const handleClose = () => {
    // sets the variable "open" to false to close the dialog
    setOpen(false)
  }

  const handleSubmit = async () => {
    /**
     * checks that form fields are filled out and contain valid inputs
     * calls addShift() with all the inputted form field values
     * parseTime() is used to change time into the correct format (scale of 0 to 2400)
     */
    if (
      name &&
      description &&
      possibleDays.length > 0 &&
      isValidNumber(hours) &&
      isValidNumber(buffer) &&
      category
    ) {
      // TODO: retrieve house code from user context instead of "EUC"
      await addShift(
        'EUC',
        name,
        description,
        1,
        possibleDays,
        [
          parseTime(startHour, startMinute, startAM),
          parseTime(endHour, endMinute, endAM),
        ],
        '',
        hours,
        verification,
        buffer,
        category
      )
      clearFields()
      handleClose()
    } else {
      console.log('Must fill out all the fields to create a shift.')
    }
  }

  const clearFields = () => {
    // resets all useState variables to reset form fields
    setName('')
    setCategory('')
    setHours(0)
    setStartHour(12)
    setStartMinute(0)
    setStartAM('AM')
    setEndHour(12)
    setEndMinute(0)
    setEndAM('AM')
    setBuffer(0)
    setDescription('')
    setPossibleDays([])
    setVerification(false)
  }

  const closeDialog = () => {
    // clears fields and closes dialog when the 'x' is clicked (top right corner of dialog)
    clearFields()
    handleClose()
  }

  const handlePossibleDays = (event: SelectChangeEvent<string>) => {
    // onclick handler for multi-select containing "possible days" input
    const input = event.target.value
    setPossibleDays(typeof input === 'string' ? input.split(',') : input)
  }

  const handleHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    // onclick handler for the number text field input containing number of hours
    const input = event.target.value
    const parsed = parseInt(input)
    if (input.length == 0 || !isNaN(parsed)) {
      setHours(parsed)
    }
  }

  const handleBuffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    // onclick handler for the number text field input containing number of buffer hours
    const input = event.target.value
    const parsed = parseInt(input)
    if (input.length == 0 || !isNaN(parsed)) {
      setBuffer(parsed)
    }
  }

  const handleVerification = (event: SelectChangeEvent<string>) => {
    // onclick handler for select containing "verification" input
    const input = event.target.value
    if (input == 'Verification required') {
      setVerification(true)
    }
    if (input == 'No verification') {
      setVerification(false)
    }
  }

  const isValidNumber = (input: number) => {
    // checks to see that a number is a valid input
    return input > 0 && !isNaN(input)
  }

  const parseTime = (hour: number, minute: number, AM: string) => {
    // parses time to match our 0-2400 scale for time
    return AM == 'AM' ? hour * 100 + minute : (hour + 12) * 100 + minute
  }

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
                  <Icon type={'close'} />
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
                  setName(event.target.value)
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
                  setCategory(event.target.value)
                }}
              >
                {Array.from(house.categories.keys())
                .sort().map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className={styles.formField}>
              <Typography>Hours worth</Typography>
              <TextField
                fullWidth
                placeholder="0"
                value={hours ? hours : ''}
                onChange={handleHours}
              />
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
                    setStartHour(event.target.value as number)
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
                    setStartMinute(event.target.value as number)
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
                    setStartAM(event.target.value)
                  }}
                >
                  <MenuItem key={'AM'} value={'AM'}>
                    AM
                  </MenuItem>
                  <MenuItem key={'PM'} value={'PM'}>
                    PM
                  </MenuItem>
                </Select>
              </div>
              <div className={styles.formField}>
                <Typography>End time</Typography>
                <Select
                  value={endHour}
                  onChange={(event) => {
                    setEndHour(event.target.value as number)
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
                    setEndMinute(event.target.value as number)
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
                    setEndAM(event.target.value)
                  }}
                >
                  <MenuItem key={'AM'} value={'AM'}>
                    AM
                  </MenuItem>
                  <MenuItem key={'PM'} value={'PM'}>
                    PM
                  </MenuItem>
                </Select>
              </div>
              <div className={styles.formField}>
                <Typography>Buffer hours</Typography>
                <TextField
                  fullWidth
                  placeholder="0"
                  value={buffer ? buffer : ''}
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
                  verification ? 'Verification required' : 'No verification'
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
                  setDescription(event.target.value)
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
  )
}

export default ShiftCard
