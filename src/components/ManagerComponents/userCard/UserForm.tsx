import { Formik, Form, FormikHelpers, FormikValues } from 'formik'
import { Stack, Button } from '@mui/material'

import dayjs from 'dayjs'
import * as Yup from 'yup'
import { TextInput, SelectInput } from '../../shared/forms/CustomFormikFields'
import {
  selectUserById,
  useAddNewUserMutation,
  useUpdateUserMutation,
} from '../../../store/apiSlices/userApiSlice'
// import { getCategories } from '../../../firebase/queries/house'
import { useSelector } from 'react-redux'
import React from 'react'
import { RootState } from '../../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { User } from '../../../types/schema'
// import { useUserContext } from '../../../context/UserContext'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const UserSchema = Yup.object({
  firstName: Yup.string(),
  lastName: Yup.string(),
  displayName: Yup.string().required('Display Name is required'),
  email: Yup.string(),
  role: Yup.string(),
  houseID: Yup.string(),
  hoursAssigned: Yup.number(),
  pinNumber: Yup.number(),
  assignedScheduledShifts: Yup.array().of(Yup.string()),
  weekMissedHours: Yup.number(),
  weekPenaltyHours: Yup.number(),
  runningTotalMissedHours: Yup.number(),
  runningTotalPenatlyHours: Yup.number(),
})

const daysList = [
  '',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const userCategories = [
  'cook dinner',
  'clean bathroom',
  'wash dishes',
  'clean basement',
]

const emptyUser = {
  // Role of the user
  role: '',
  // Last Name
  lastName: '',
  // First Name
  firstName: '',
  // full name that gets displayed
  displayName: '',
  // User email
  email: '',
  // The houseID of the house that the user resides in
  houseID: '',
  // Hours the user has been assigned
  hoursAssigned: 0,
  // Hours the user must be assigned, always set to 5

  // Pin Number for verifying other people's tasks
  pinNumber: 0,
  // Total fines assessed to this user

  // Map of availabilities (day: time windows when they're free)
  //   availabilities: { string: number[] }
  // Map of preferences (taskID: (0/1/2 (higher number = greater preference)))
  //   preferences: { string: number }

  //** new attributes below */

  // The scheduled shifts that the user has been assigned
  assignedScheduledShifts: [],
  // Missed workshift hours this user has missed this current week
  weekMissedHours: 0,
  // Hours that manager has added to this user as a penatly for missing a shift this current week
  weekPenaltyHours: '',
  // The running total of missed workshift hours for the whole semester
  runningTotalMissedHours: '',
  // The running total of penalty hours for the whole semester
  runningTotalPenatlyHours: '',
}

const UserForm = ({
  setOpen,
  userId,
  isNewUser,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  userId?: string
  isNewUser: boolean
}) => {
  // const { authUser, house } = useUserContext()
  // const [currentUser, setCurrentUser] = React.useState(User)

  // const userCategories = getCategories(house.houseID) //TODO: use redux api slice once implemented

  //* Get API helpers to create or update a user
  const [
    addNewUser,
    {
      // isLoading: isLoadingNewUser,
      // isSuccess: isSuccessNewUser,
      // isError: isErrorNewUser,
      // error: errorNewUser,
    },
  ] = useAddNewUserMutation()
  const [
    updateUser,
    {
      // isLoading: isLoadingUpdateUser,
      // isSuccess: isSuccessUpdateUser,
      // isError: isErrorUpdateUser,
      // error: errorUpdateUser,
    },
  ] = useUpdateUserMutation()

  const user: User = useSelector(
    (state: RootState) =>
      selectUserById('EUC')(state, userId as EntityId) as User
  )

  const onSubmit = async (
    values: FormikValues,
    formikBag: FormikHelpers<FormikValues>
  ) => {
    // console.log('Submiting UserForm: ', values)
    const { name } = values

    // console.log(dayjs('1900', 'HHmm').format('HHmm'))
    // const num = 1900
    // console.log(dayjs(num.toString(), 'HHmm'))

    // const dayString = possibleDays.join('')
    let result

    const data = { data: {}, houseId: '', userId: '' }
    data.data = {
      name,
    }
    data.houseId = 'EUC'
    data.userId = userId ? userId : ''
    // console.log('data: ', data)
    if (isNewUser || !userId) {
      result = await addNewUser(data)
    } else {
      result = await updateUser(data)
    }
    if (result) {
      console.log('success with user: ', result)
    }

    formikBag.resetForm()
    setOpen(false)
  }

  // React.useEffect(() => {
  //   console.log('This is the selected user', user)
  // }, [user])

  return (
    <>
      <Formik
        validationSchema={UserSchema}
        initialValues={{
          firstName: user ? user.firstName : emptyUser.firstName,
          lastName: user ? user.lastName : emptyUser.lastName,
          displayName: user ? user.displayName : emptyUser.displayName,
          email: user ? user.email : emptyUser.email,
          role: user ? user.role : emptyUser.role,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <TextInput name="firstName" label="First Name" />
            <TextInput name="lastName" label="Last Name" />
            <TextInput name="displayName" label="Display Name" />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isNewUser || !userId ? 'Submit' : 'Update'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default UserForm
