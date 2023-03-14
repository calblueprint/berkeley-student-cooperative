import { Box, Paper, styled, Typography } from '@mui/material'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectShiftById } from '../../../store/apiSlices/shiftApiSlice'
import { RootState } from '../../../store/store'
import Grid from '@mui/material/Unstable_Grid2'
import { Shift } from '../../../types/schema'
import styles from './ShiftInfoHeader.module.css'
import XButton from '../../shared/buttons/XButton'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const ShiftInfoHeader = ({
  shiftId,
  selectedDay,
  handleClose,
}: {
  shiftId?: EntityId
  selectedDay: string
  handleClose: () => void
}) => {
  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById('EUC')(state, shiftId as EntityId) as Shift
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid xs={'auto'} md={'auto'} lg={'auto'}>
          <h1>{shift.name}</h1>
        </Grid>
        {/* <Grid xs /> */}
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          <XButton handleClose={handleClose} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid container xs={'auto'} md={'auto'} lg={'auto'} spacing={4}>
          <Grid xs={'auto'} lg={'auto'}>
            <Typography fontFamily={'Inter'} color={'#ACACAC'}>
              Worth
            </Typography>
          </Grid>
          <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
            <Typography>
              {shift.hours} {shift.hours < 2 ? 'hour' : 'hours'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={'auto'} md={'auto'} lg={'auto'} spacing={4}>
          <Grid xs={'auto'} lg={'auto'}>
            <Typography fontFamily={'Inter'} color={'#ACACAC'}>
              Window
            </Typography>
          </Grid>
          <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
            <Typography>
              {selectedDay[0].toUpperCase() + selectedDay.slice(1)}{' '}
              {shift.timeWindowDisplay}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
export default ShiftInfoHeader
