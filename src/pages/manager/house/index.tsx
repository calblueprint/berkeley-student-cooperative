import { Box, Typography } from '@mui/material'
// import Head from 'next/head'
import Layout from '../../../components/Layout/Layout'
// import ParseCSV from '../../ParseCsv/ParseCsv'

export default function SchedulePage() {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        Members
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Typography color={'#000'}>Coming Soon!!!</Typography>
      </Box>
      {/* <div>
        <Head>
          <title>Workshift App</title>
          <meta name="description" content="Next.js firebase Workshift app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <ParseCSV />
        </main>
        <footer>
          <a href="#" rel="noopener noreferrer">
            Workshift App
          </a>
        </footer>
      </div> */}
    </Layout>
  )
}
