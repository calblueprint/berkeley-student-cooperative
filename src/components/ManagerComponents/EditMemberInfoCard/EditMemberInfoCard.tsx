import React, { useEffect, useState } from 'react'
import { User } from '../../../types/schema'
import Icon from '../../../assets/Icon'
import styles from './EditMemberInfoCard.module.css'
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from '@mui/material'
import { getUser, updateUser } from '../../../firebase/queries/user'

type EditMemberInfoCardProps = {
  memberID: string
}

const EditMemberInfoCard: React.FC<EditMemberInfoCardProps> = ({
  memberID,
}: EditMemberInfoCardProps) => {
  const [member, setMember] = useState<User | null>()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const openDialog = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    /**
     * Updates the shift useState.
     *
     * @remarks
     * This method is uses the houseID and shiftID props that get passed in.
     *
     */

    const getMember = async () => {
      const currUser = await getUser(memberID)
      setMember(currUser)
    }
    getMember()
    console.log(memberID, member)
  }, [memberID])

  useEffect(() => {
    /**
     * Updates the shift useState.
     *
     * @remarks
     * This method is uses the houseID and shiftID props that get passed in.
     *
     */
    if (member) {
      setName(member.firstName)
      setEmail(member.email)
    }

    console.log(memberID, member)
  }, [member])

  // Closes the modal without pushing anything to firebase
  const closeModal = () => {
    setOpen(false)
  }

  const saveButton = () => {
    const resetNameAndEmail = async () => {
      const newData = {
        firstName: name,
        email: email,
      }
      if (member) {
        await updateUser(memberID, newData)
      }
    }
    resetNameAndEmail()
    closeModal()
  }

  return (
    <div>
      <Button onClick={openDialog}>Click Me</Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <div className={styles.box}>
            <div className={styles.header}>
              <Typography variant="h4">Edit information</Typography>
              <Button onClick={closeModal}>
                <Icon type={'close'} />
              </Button>
            </div>
            <hr />
            <div className={styles.info}>
              <Typography variant="body1">Member name</Typography>
              <TextField
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                }}
                placeholder="{membername}"
              />
            </div>
            <div className={styles.info}>
              <Typography variant="body1">Email address</Typography>
              <TextField
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                }}
                placeholder="{longemailusername@berkeley.edu}"
              />
            </div>
          </div>
          <div className={styles.save}>
            <Button onClick={saveButton}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default EditMemberInfoCard
