import * as React from 'react'
import { useRouter } from 'next/router'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import styles from './MemberNavbar.module.css'
import Icon from '../../../assets/Icon'
// import { useUserContext } from '../../../context/UserContext'
import { useAuthLogOutMutation } from '../../../store/apiSlices/authApiSlice'
import {
  selectCurrentUser,
  selectCurrentHouse,
} from '../../../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { User, House } from '../../../types/schema'

const MemberNavbar: React.FunctionComponent = () => {
  /**
   * Returns the navigation bar component for members
   *
   * no params
   * user is retrieved from the context using useUserContext()
   *
   */
  const router = useRouter()
  // const { authUser, signOutAuth } = useUserContext()
  const [authLogOut, { isSuccess }] = useAuthLogOutMutation()
  const authUser = useSelector(selectCurrentUser) as User
  const authHouse = useSelector(selectCurrentHouse) as House

  React.useEffect(() => {
    console.log('authUser: ' + authUser)
    console.log('authHouse: ' + authHouse)
    if (isSuccess) {
      console.log('logging out')
      router.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, authHouse, isSuccess])

  const userDetails = (
    // Renders user details - name and role
    <ListItem className={styles.item + ' ' + styles.userDetails}>
      <Icon type="navProfile" className={styles.icon} />
      <div>
        <Typography variant="subtitle1" color={'#FFFFFF'}>
          {authUser ? `${authUser?.firstName} ${authUser?.lastName}` : 'Member'}
        </Typography>
        <Typography variant="subtitle1" color={'#FFFFFF'}>
          {authUser ? `Role: ${authUser.role}` : 'House Member'}
        </Typography>
      </div>
    </ListItem>
  )

  const pages = (
    /**
     * Renders navigation bar buttons for 3 pages - schedule, planner, house
     *
     * schedule is the default page
     * onClick handler pushes "/member/[page name]" to the url using router
     */
    <List className={styles.pages}>
      <ListItem
        button
        key={'schedule'}
        onClick={() => {
          router.push('/member/schedule')
        }}
        className={
          router.pathname == '/member/schedule' ? styles.active : styles.item
        }
      >
        <div className={styles.icon}>
          <Icon type="navSchedule" />
        </div>
        <ListItemText
          primaryTypographyProps={{ fontSize: '18px' }}
          className={styles.itemText}
          primary={'Schedule'}
        />
      </ListItem>
      <ListItem
        button
        key={'planner'}
        onClick={() => {
          router.push('/member/planner')
        }}
        className={
          router.pathname == '/member/planner' ? styles.active : styles.item
        }
      >
        <div className={styles.icon}>
          <Icon type="navPlanner" />
        </div>
        <ListItemText
          primaryTypographyProps={{ fontSize: '18px' }}
          className={styles.itemText}
          primary={'Planner'}
        />
      </ListItem>
      <ListItem
        button
        key={'house'}
        onClick={() => {
          router.push('/member/house')
        }}
        className={
          router.pathname == '/member/house' ? styles.active : styles.item
        }
      >
        <div className={styles.icon}>
          <Icon type="navMembers" />
        </div>
        <ListItemText
          primaryTypographyProps={{ fontSize: '18px' }}
          className={styles.itemText}
          primary={'Members'}
        />
      </ListItem>
    </List>
  )

  const logout = (
    <div className={styles.logout}>
      <ListItem
        className={styles.item}
        button
        key={'settings'}
        onClick={() => {
          // signout MUST happen before pushing the login page, or else there is an error cuz the user context tries to use an empty user
          authLogOut({})
        }}
      >
        <Icon type="navLogout" />
        <ListItemText
          primaryTypographyProps={{
            fontSize: '18px',
            color: '#FFFFFF',
            fontWeight: 600,
          }}
          className={styles.itemText}
          primary={'Logout'}
        />
      </ListItem>
    </div>
  )

  return (
    <div className={styles.container}>
      {userDetails}
      {pages}
      {logout}
    </div>
  )
}

export default MemberNavbar
