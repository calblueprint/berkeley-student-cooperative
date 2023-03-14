import React from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../../components/Layout/Layout'
import { MemberScheduleHeader } from '../../../components/MemberComponents/MemberSchedule/MemberScheduleHeader/MemberScheduleHeader'
import { MemberShiftView } from '../../../components/MemberComponents/MemberSchedule/MemberShiftView/MemberShiftView'
// import { useUserContext } from '../../../context/UserContext'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import { House, User } from '../../../types/schema'
// import styles from './MemberSchedule.module.css'

type MemberSchedulePageProps = {
  user?: User
  house?: House
}

const MemberSchedulePage: React.FC<MemberSchedulePageProps> = ({
  user,
  house,
}) => {
  // const { authUser, signIn, signOutAuth, register } = useUserContext()
  const authUser = useSelector(selectCurrentUser) as User

  return (
    <Layout>
      <MemberScheduleHeader />
      <MemberShiftView user={authUser} />
    </Layout>
  )
}

export default MemberSchedulePage
