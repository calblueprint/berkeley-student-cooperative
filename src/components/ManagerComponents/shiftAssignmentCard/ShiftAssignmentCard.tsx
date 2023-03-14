import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from '../shiftInfoHeader/ShiftInfoHeader'
import styles from './ShiftAssignmentCard.module.css'
import SelectedUserComponent from '../selectedUserComponent/SelectedUserComponent'
import AvailableUsersTable from '../../../pages/AvailableUsersTable'

export const ShiftAssignmentCard = ({
  shiftId,
  selectedDay,
  handleClose,
  open,
}: {
  shiftId?: EntityId
  selectedDay: string
  handleClose: () => void
  open: boolean
}) => {
  const [assignedUserId, setAssignedUserID] = useState<EntityId>('')

  const handleAssignedUserId = (userId: EntityId) => {
    console.log(userId)
    setAssignedUserID(userId)
  }

  let content = null
  if (open) {
    content = (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleClose}
          className="dialog"
        >
          <DialogTitle className={styles.header}>
            <ShiftInfoHeader
              shiftId={shiftId}
              selectedDay={selectedDay}
              handleClose={handleClose}
            />
          </DialogTitle>
          <DialogContent>
            <SelectedUserComponent
              userId={assignedUserId}
              handleClick={() => console.log('CLICK')}
            />
            <AvailableUsersTable
              day={selectedDay}
              houseID={'EUC'}
              shiftID={shiftId as string}
              handleAssignedUserId={handleAssignedUserId}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return content
}
