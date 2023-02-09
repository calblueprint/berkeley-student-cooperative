import * as React from 'react'
import { useRouter } from 'next/router'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import styles from './ManagerNavbar.module.css'
import Icon from '../../../assets/Icon'
import { useUserContext } from '../../../context/UserContext'

const ManagerNavbar: React.FunctionComponent = () => {
  /**
   * Returns the navigation bar component for managers
   *
   * no params
   * user is retrieved from the context using useUserContext()
   *
   */
  const router = useRouter()
  const { authUser, signOutAuth } = useUserContext()

  const userDetails = () => (
    // Renders user details - name and role
    <ListItem className={styles.item + ' ' + styles.userDetails}>
      <Icon type="navProfile" className={styles.icon} />
      <div>
        <Typography variant="subtitle1" color={'#FFFFFF'}>
          {authUser.firstName} {authUser.lastName}
        </Typography>
        <Typography variant="subtitle1" color={'#FFFFFF'}>
          {authUser.role}
        </Typography>
      </div>
    </ListItem>
  )

  const pages = () => (
    /**
     * Renders navigation bar buttons for 3 pages - schedule, planner, house
     *
     * schedule is the default page
     * onClick handler pushes "/manager/[page name]" to the url using router
     */
    <List className={styles.pages}>
      <ListItem
        button
        key={'schedule'}
        onClick={() => {
          router.push('/manager/schedule')
        }}
        className={
          router.pathname == '/manager/schedule' ? styles.active : styles.item
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
          router.push('/manager/planner')
        }}
        className={
          router.pathname == '/manager/planner' ? styles.active : styles.item
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
          router.push('/manager/house')
        }}
        className={
          router.pathname == '/manager/house' ? styles.active : styles.item
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

  const logout = () => (
    <div className={styles.logout}>
      <ListItem
        className={styles.item}
        button
        key={'settings'}
        onClick={() => {
          // signout MUST happen before pushing the login page, or else there is an error cuz the user context tries to use an empty user
          signOutAuth()
          router.push('/login')
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
      {userDetails()}
      {pages()}
      {logout()}
    </div>
  )
}

export default ManagerNavbar
