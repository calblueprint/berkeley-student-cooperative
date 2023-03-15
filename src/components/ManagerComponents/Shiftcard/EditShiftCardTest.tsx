import React from 'react'
import ShiftForm from './ShiftForm'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

function EditShiftCardTest({
  shiftId,
  setOpen,
  open,
}: {
  shiftId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}) {
  React.useEffect(() => {
    // console.log(selectShiftsResult((state) => state))
  }, [])
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        className="dialog"
      >
        <DialogTitle variant="h4" component="h2">
          Update Shift
        </DialogTitle>
        <DialogContent>
          <ShiftForm
            setOpen={setOpen}
            shiftId={shiftId} //'6401c47de8d154aa9ccf5d93'
            isNewShift={false}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default EditShiftCardTest
