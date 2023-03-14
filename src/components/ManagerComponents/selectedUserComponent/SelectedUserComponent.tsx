import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectUserById } from '../../../store/apiSlices/userApiSlice'
import { RootState } from '../../../store/store'
import { User } from '../../../types/schema'
import XButton from '../../shared/buttons/XButton'

const DisplayAssignedUser = ({ userId }: { userId?: EntityId }) => {
  const user: User = useSelector(
    (state: RootState) => selectUserById(state, userId as EntityId) as User
  )
  if (userId) {
    return <Typography>{user?.firstName}</Typography>
  } else {
    return <Typography>No assigned user</Typography>
  }
}

const SelectedUserComponent = ({
  userId,
  handleClick,
}: {
  userId?: EntityId
  handleClick: () => void
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid xs={'auto'} md={'auto'} lg={'auto'}>
          <DisplayAssignedUser userId={userId} />
        </Grid>
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          {userId ? <XButton handleClick={handleClick} /> : null}
        </Grid>
      </Grid>
    </Box>
  )
}
export default SelectedUserComponent
