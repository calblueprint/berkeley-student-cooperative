import { useState } from 'react'
import * as React from 'react'
import styles from './ShiftCard.module.css'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { addShift } from '../../../firebase/queries/shift'
import Icon from '../../../assets/Icon'
import ShiftForm from './ShiftForm'

const ShiftCard = () => {
  const [open, setOpen] = useState(false)
  // TODO: import shift categories
  const shiftCategories = [
    'cook dinner',
    'clean bathroom',
    'wash dishes',
    'clean basement',
  ]
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

  const handleOpen = () => {
    // sets the variable "open" to true to open the dialog
    setOpen(true)
  }

  const handleClose = () => {
    // sets the variable "open" to false to close the dialog
    setOpen(false)
  }

  return (
    <React.Fragment>
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
        <DialogTitle>
          <Typography className={styles.title} variant="h4">
            Create Shift
          </Typography>
          <Button onClick={handleClose} className={styles.close}>
            <Icon type={'close'} />
          </Button>
        </DialogTitle>
        <DialogContent>
          <ShiftForm
            setOpen={setOpen}
            shiftId="3InBjF0Nz81DClddjZ1b"
            isNewShift={false}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default ShiftCard
