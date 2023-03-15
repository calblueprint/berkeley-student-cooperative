import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../../components/Layout/Layout'
// import AvailabilityInfo from '../../../components/MemberComponents/AvailabilityInfo/AvailabilityInfo'
import SettingsInfo from '../../../components/MemberComponents/SettingsInfo/SettingsInfo'
import TaskPreferenceInfo from '../../../components/MemberComponents/TaskPreferenceInfo/TaskPreferenceInfo'
// import { useUserContext } from '../../../context/UserContext'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import { User } from '../../../types/schema'
// import styles from './Settings.module.css'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function SettingsPage() {
  // const { authUser } = useUserContext()
  const authUser = useSelector(selectCurrentUser) as User
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Layout>
      <Typography variant="h4">Settings</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Information" {...a11yProps(0)} />
            <Tab label="Availability" {...a11yProps(1)} />
            <Tab label="Preferences" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <SettingsInfo userID={authUser.userID} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* <AvailabilityInfo userID={authUser.userID} /> */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TaskPreferenceInfo userID={authUser.userID} />
        </TabPanel>
      </Box>
    </Layout>
  )
}
