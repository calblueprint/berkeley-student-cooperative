import { Tabs, Tab, Box, Typography } from '@mui/material'
import Layout from '../../../components/Layout/Layout'
import { useState } from 'react'
import CategoriesView from './categoryDropdown/categoriesView'
import { useUserContext } from '../../../context/UserContext'
import ShiftSchedule from '../../../components/ManagerComponents/shiftSchedule/ShiftSchedule'
import { UnassignedTabContent } from './UnassignedTabContent'
import ReduxTesting from './ReduxTesting'
import { AssignedTabContent } from './AssignedTabContent'

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function SchedulePage() {
  /**
   * Allows for navigation between unassigned shifts, assigned shifts, and the category view page. Used in the planner view.
   * @returns SchedulePage
   */
  const { authUser } = useUserContext()

  const [currPage, setCurrPage] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.log(authUser)
    setCurrPage(newValue)
  }

  return (
    <Layout>
      <Typography variant="h4">Settings</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currPage} onChange={handleChange}>
            <Tab label="Unassigned" {...a11yProps(0)} />
            <Tab label="Assigned" {...a11yProps(1)} />
            <Tab label="Categories" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={currPage} index={0}>
          <UnassignedTabContent />
          <ReduxTesting />
        </TabPanel>
        <TabPanel value={currPage} index={1}>
          <AssignedTabContent />
        </TabPanel>
        <TabPanel value={currPage} index={2}>
          <CategoriesView houseID={authUser.houseID} />
        </TabPanel>
      </Box>
    </Layout>
  )
}
