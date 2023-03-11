import React from 'react'
import UserForm from './UserForm'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

function EditUserCardTest({
  userId,
  setOpen,
  open,
}: {
  userId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
}) {
  React.useEffect(() => {
    // console.log(selectUsersResult((state) => state))
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
          Edit information
        </DialogTitle>
        <DialogContent>
          <UserForm
            setOpen={setOpen}
            userId={userId} //'6401c47de8d154aa9ccf5d93'
            isNewUser={false}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default EditUserCardTest
