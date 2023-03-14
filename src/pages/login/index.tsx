import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import BscLogo from '../../assets/bsclogo.png'
import styles from './Login.module.css'
import { useEffect, useState } from 'react'
// import { useFirebaseAuth } from '../../firebase/queries/auth'
import Layout from '../../components/Layout/Layout'
import { useRouter } from 'next/router'
import { useLoginMutation } from '../../store/apiSlices/authApiSlice'
import { selectCurrentUser } from '../../store/slices/authSlice'
import { useSelector } from 'react-redux'
import { User } from '../../types/schema'

export default function LoginPage() {
  /**
   * Displays a login page for all users
   *
   * sets the context if login information is correct and pushes the router to the manager/member default page
   */
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const { signIn, authUser, register } = useFirebaseAuth()
  const authUser = useSelector(selectCurrentUser) as User

  const [
    login,
    {
      // isLoading: loginLoading,
      // isSuccess: loginSuccess,
      // isError: loginError,
      // error: errorLoggingIn,
    },
  ] = useLoginMutation({})

  const login2 = async () => {
    await login({ email, password })
  }

  // pushes the router to the member/manager default page if the user is set in the context
  useEffect(() => {
    if (authUser.id) {
      console.log('------authUser: ', authUser)
      if (authUser.role == 'Member' || authUser.role == 'member') {
        router.push('/member/dashboard')
      } else {
        router.push('/manager/schedule')
      }
    }
  })

  // onClick handler that pushes the router to the create account page
  const createAccount = () => {
    router.push('/createAccount')
  }
  return authUser.id ? (
    <Layout />
  ) : (
    <div className={styles.login}>
      <div className={styles.logo}>
        <Image src={BscLogo} alt="bsc logo" width={150} height={70} />
      </div>

      <div className={styles.card}>
        <div className={styles.body}>
          <Typography variant="body1" className={styles.text}>
            Email address
          </Typography>
          <TextField
            className={styles.textfield}
            fullWidth
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
          <Typography variant="body1" className={styles.text}>
            Password
          </Typography>
          <TextField
            className={styles.textfield}
            fullWidth
            value={password}
            type={'password'}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />
          <div className={styles.flex}>
            <FormControlLabel
              className={styles.checkbox}
              control={<Checkbox />}
              label="Remember me"
            />
            <Typography className={styles.forgotPW}>
              Forgot your password?
            </Typography>
          </div>
          <div className={styles.button}>
            <Button
              variant="contained"
              fullWidth
              disableElevation
              onClick={login2}
            >
              Login
            </Button>
          </div>
          <Button className={styles.createAccount} onClick={createAccount}>
            Create an account
          </Button>
          <Typography className={styles.createAccount}></Typography>
        </div>
      </div>
    </div>
  )
}
