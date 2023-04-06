import { Box, Typography } from '@mui/material'
import React from 'react'
// import { useSelector } from 'react-redux'
import Layout from '../../../components/Layout/Layout'
import SettingsInfo from '../../../components/MemberComponents/SettingsInfo/SettingsInfo'
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
      <SettingsInfo />
    </Layout>
  )
}

export default MemberSchedulePage
