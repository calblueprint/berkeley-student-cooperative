import UserForm from './UserForm'
import {
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'

function NewUserCardTest({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(false)
  // const [userValues, setUserValues] = useState(null)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <>
      <Button fullWidth variant="outlined" onClick={handleOpen}>
        <Typography>Add User</Typography>
      </Button>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        className="dialog"
      >
        <DialogTitle variant="h4" component="h2">
          Create User
        </DialogTitle>
        <DialogContent>
          <UserForm
            setOpen={setOpen}
            // userId={userId} //'6401c47de8d154aa9ccf5d93'
            isNewUser={true}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
export default NewUserCardTest
