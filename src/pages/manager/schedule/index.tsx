import { Box, Typography } from '@mui/material'
import Layout from '../../../components/Layout/Layout'
// import ShiftSchedule from '../../../components/ManagerComponents/shiftSchedule/ShiftSchedule'

export default function SchedulePage() {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        House Schedule
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Typography color={'#000'}>Coming Soon!!!</Typography>
      </Box>
      {/* <ShiftSchedule /> */}
    </Layout>
  )
}
