import ShiftForm from './ShiftForm'
import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'

function ShiftCardTest() {
  const [open, setOpen] = useState(false)
  // const [shiftValues, setShiftValues] = useState(null)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <>
      <Button fullWidth variant="outlined" onClick={handleOpen}>
        <Typography>Add Shift</Typography>
      </Button>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className="dialog"
      >
        <DialogTitle variant="h4" component="h2">
          Create Shift
        </DialogTitle>
        <DialogContent>
          <ShiftForm
            setOpen={setOpen}
            // shiftId='6401c47de8d154aa9ccf5d93'
            isNewShift={true}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default ShiftCardTest
