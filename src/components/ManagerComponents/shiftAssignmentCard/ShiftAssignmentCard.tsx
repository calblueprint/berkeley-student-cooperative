import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from '../shiftInfoHeader/ShiftInfoHeader'
import styles from './ShiftAssignmentCard.module.css'
import SelectedUserComponent from '../selectedUserComponent/SelectedUserComponent'
import AvailableUsersTable from './AvailableUsersTable'

export const ShiftAssignmentCard = ({
  shiftId,
  selectedDay,
  handleClose,
  handleEditShift,
  open,
}: {
  shiftId?: EntityId
  selectedDay: string
  handleClose: () => void
  handleEditShift?: (shiftId: string) => void
  open: boolean
}) => {
  const [assignedUserId, setAssignedUserID] = useState<EntityId>('')
  const [unselect, setUnselect] = useState<boolean>(false)

  const handleAssignedUserId = (userId: EntityId) => {
    // console.log(userId)
    setAssignedUserID(userId)
    setUnselect(false)
  }

  const handleUnassignedUserId = () => {
    setUnselect(true)
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
              handleClick={handleUnassignedUserId}
            />
            <AvailableUsersTable
              day={selectedDay}
              houseID={'EUC'}
              shiftID={shiftId as string}
              handleAssignedUserId={handleAssignedUserId}
              handleEditShift={handleEditShift}
              handleClose={handleClose}
              unselect={unselect}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // console.log('ASSIGNED USER: ' + assignedUserId)
  return content
}
