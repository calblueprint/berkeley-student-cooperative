import type { NextPage } from 'next'
import Layout from '../../../components/Layout/Layout'
import { Box, Typography } from '@mui/material'
const Home: NextPage = () => {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        Dashboard
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Typography color={'#000'}>Coming Soon!!!</Typography>
      </Box>
    </Layout>
  )
}

export default Home
