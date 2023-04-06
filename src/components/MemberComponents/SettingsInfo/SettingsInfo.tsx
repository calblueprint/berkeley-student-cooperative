import { Button, Card, CardContent, Typography } from '@mui/material'
import { useState, useEffect } from 'react'

import { updateUser } from '../../../firebase/queries/user'
import { generatePinNumber } from '../../../firebase/helpers'
import { House, User } from '../../../types/schema'
import styles from './SettingsInfo.module.css'
import { lightButton } from '../../../assets/StyleGuide'
// import { useSelector } from 'react-redux'
import EditUserCard from '../../shared/userCard/EditUserCard'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { useUpdateUserMutation } from '../../../store/apiSlices/userApiSlice'

// type SettingsInfoProps = {
//   userID: string
// }

const SettingsInfo = () => {
  /**
   * Returns a card component to display a member's personal information in the settings page
   *
   * @param userID - ID of the member
   */
  // const [user, setUser] = useState<User | null>()
  // const [house, setHouse] = useState<House | null>()
  const [editing, setEditing] = useState<boolean>(false)
  const [editType, setEditType] = useState<string | undefined>()

  // const [name, setName] = useState<string | null>()
  // const [email, setEmail] = useState<string | null>()
  const [pin, setPin] = useState<number | null>()
  const star = '*'

  const user = useSelector(selectCurrentUser) as User
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()


  // useEffect(() => {
  //   // retrieves user from context
  //   const getData = async () => {
  //     const currUser = await getUser(userID)
  //     setUser(currUser)
  //   }
  //   getData()
  // }, [userID])

  // useEffect(() => {
  //   setName(user?.firstName + ' ' + user?.lastName)
  //   setEmail(user?.email)
  //   setPin(user?.pinNumber)
  //   const getData = async () => {
  //     if (user) {
  //       const currHouse = await getHouse(user.houseID)
  //       setHouse(currHouse)
  //     }
  //   }
  //   getData()
  // }, [user])

  const handleOpenName = () => {
    setEditType('Name')
    setEditing(true)
  }

  const handleOpenEmail = () => {
    setEditType('Email')
    setEditing(true)
  }

  const handleOpenPassword = () => {
    setEditType('Password')
    setEditing(true)
  }

  const resetPin = async () => {
    const newPin = generatePinNumber(5)
    setPin(newPin)
    const newData = {
      pinNumber: newPin,
    }
    if (user) {
      const data = {data:{}, userId: userId}
      await updateUser(data)
    }
  }

  return user && user.houseID ? (
    <div className={styles.content}>
      <EditUserCard
        userId={user.userID}
        open={editing}
        setOpen={setEditing}
        editType={editType}
      />
      <Card>
        <CardContent className={styles.card}>
          <div className={styles.body}>
            <Typography className={styles.bodyTitle} variant="h5">
              Name
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {user.displayName}
              </Typography>
              <div className={styles.edit}>
                <Button sx={lightButton} onClick={handleOpenName}>
                  Edit
                </Button>
              </div>
            </div>

            <Typography className={styles.bodyTitle} variant="h5">
              Email
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {user.email}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={handleOpenEmail} sx={lightButton}>
                  Edit
                </Button>
              </div>
            </div>

            <Typography className={styles.bodyTitle} variant="h5">
              Password
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {star.repeat(10)}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={handleOpenPassword} sx={lightButton}>
                  Edit
                </Button>
              </div>
            </div>
            <Typography className={styles.bodyTitle} variant="h5">
              Pin Code
            </Typography>
            <div className={styles.flex}>
              <Typography className={styles.bodyText} variant="body1">
                {pin}
              </Typography>
              <div className={styles.edit}>
                <Button onClick={resetPin} sx={lightButton}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div></div>
  )
}

export default SettingsInfo
