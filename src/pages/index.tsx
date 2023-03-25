import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// import { useFirebaseAuth } from '../firebase/queries/auth'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/slices/authSlice'
import { User } from '../types/schema'

const Home: NextPage = () => {
  const router = useRouter()
  const currUser = useSelector(selectCurrentUser) as User
  // const { authUser } = useFirebaseAuth()

  useEffect(() => {
    if (!currUser.id) {
      router.push('/login')
    }
  }, [currUser])

  return <></>
}

export default Home
