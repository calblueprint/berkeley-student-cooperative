import { Box, Typography } from '@mui/material'
import React from 'react'
import Layout from '../../../components/Layout/Layout'
import { House, User } from '../../../types/schema'

type MemberSchedulePageProps = {
  user?: User
  house?: House
}

const MemberSchedulePage: React.FC<MemberSchedulePageProps> = () => {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        House Schedule
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Typography color={'#000'}>Coming Soon!!!</Typography>
      </Box>
    </Layout>
  )
}

export default MemberSchedulePage
