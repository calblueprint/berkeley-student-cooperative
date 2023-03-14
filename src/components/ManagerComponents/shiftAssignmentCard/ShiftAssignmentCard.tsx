import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { EntityId } from '@reduxjs/toolkit'
import ShiftInfoHeader from '../shiftInfoHeader/shiftInfoHeader'
import styles from './ShiftAssignmentCard.module.css'
import { RootState } from '../../../store/store'
import { Shift, User } from '../../../types/schema'
import { useSelector } from 'react-redux'
import { selectShiftById } from '../../../store/apiSlices/shiftApiSlice'
import { selectUserById } from '../../../store/apiSlices/userApiSlice'
import Paper from '@mui/material/Paper'
import XButton from '../../shared/buttons/XButton'

const DisplayAssignedUser = ({ userId }: { userId?: EntityId }) => {
  const user: User = useSelector(
    (state: RootState) => selectUserById(state, userId as EntityId) as User
  )
  if (userId) {
    return <div>{user?.firstName}</div>
  } else {
    return <p>No user assigned</p>
  }
}

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
  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById('EUC')(state, shiftId as EntityId) as Shift
  )

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
            <DisplayAssignedUser userId={shift.assignedUser} />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return content
}
