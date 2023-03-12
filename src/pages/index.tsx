import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFirebaseAuth } from '../firebase/queries/auth'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/slices/authSlice'

const Home: NextPage = () => {
  const router = useRouter()
  const currUser = useSelector(selectCurrentUser)
  const { authUser } = useFirebaseAuth()

  useEffect(() => {
    if (!currUser) {
      router.push('/login')
    }
  }, [currUser])

  return <></>
}

export default Home
