import type { NextPage } from 'next'
import Layout from '../../components/Layout/Layout'
// import SortedTable from '../../components/shared/tables/SortedTable'
// import { HeadCell } from '../../interfaces/interfaces'
import { Box, Typography } from '@mui/material'

const Home: NextPage = () => {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        Dashboard
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Typography color={'#000'}>Dashbaord</Typography>
      </Box>
    </Layout>
  )
}

export default Home
