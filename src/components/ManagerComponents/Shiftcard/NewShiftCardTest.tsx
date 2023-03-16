import ShiftForm from './ShiftForm'
import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import styles from './ShiftForm.module.css'
import Icon from '../../../assets/Icon'

function NewShiftCardTest({ shiftId }: { shiftId?: string }) {
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

      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
        <div className={styles.shiftBox}>
          <div>
            <div className={styles.flex}>
              <DialogTitle
                variant="h4"
                component="h2"
                className={styles.dialogTitle}
              >
                Create Shift
              </DialogTitle>
              <Button onClick={handleClose} className={styles.close}>
                <Icon type={'close'} />
              </Button>
            </div>
            <hr className={styles.line}/>
          </div>
          <div className={styles.content}>
            <DialogContent>
              <ShiftForm
                setOpen={setOpen}
                // shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
                isNewShift={true}
              />
            </DialogContent>
          </div>
        </div>
      </Dialog>
    </>
  )
}
export default NewShiftCardTest
