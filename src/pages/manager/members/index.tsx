import { Button, Typography } from '@mui/material'
import Layout from '../../../components/Layout/Layout'
import NewUserCard from '../../../components/ManagerComponents/userCard/NewUserCard'

export default function memberPage() {
  return (
    <Layout>
      <Typography variant="h4" color={'#000'}>
        Members
      </Typography>
      <NewUserCard />
    </Layout>
  )
}
