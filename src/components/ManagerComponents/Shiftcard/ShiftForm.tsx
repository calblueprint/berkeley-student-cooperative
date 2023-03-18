import { Formik, Form, FormikHelpers, FormikValues } from 'formik'
import { Button, Typography } from '@mui/material'
import * as Yup from 'yup'
import { TextInput, SelectInput } from '../../shared/forms/CustomFormikFields'
import {
  selectShiftById,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
} from '../../../store/apiSlices/shiftApiSlice'
import { useSelector } from 'react-redux'
import React from 'react'
import { RootState } from '../../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { Shift } from '../../../types/schema'
import styles from './ShiftForm.module.css'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const ShiftSchema = Yup.object({
  name: Yup.string()
    .typeError('Must be a string')
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  category: Yup.string().required('Category is required'),
  members: Yup.number()
    .typeError('Must be a number')
    .positive('Must be greater than zero')
    .integer()
    .required('Members is required'),
  hours: Yup.number()
    .typeError('Must be a number')
    .required('Hours is required'),
  possibleDays: Yup.array()
    .of(Yup.string())
    .required('Possible days is required')
    .min(1, 'Possible days is required'),
  timeWindowStartTime: Yup.string().required('Start time is required'),
  timeWindowEndTime: Yup.string().required('End time is required'),
  verificationBuffer: Yup.number()
    .typeError('Must be a number')
    .required('Buffer hours is required'),
  verification: Yup.string().required('Verification type is required'),
  description: Yup.string()
    .typeError('Must be a string')
    .required('Description is required'),
  assignedUser: Yup.string(),
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

const shiftCategories = [
  'cook dinner',
  'clean bathroom',
  'wash dishes',
  'clean basement',
]
const verificationOptions = ['Verification required', 'No verification']
const timeWindows = [
  '12:00 AM',
  '12:30 AM',
  '1:00 AM',
  '1:30 AM',
  '2:00 AM',
  '3:30 AM',
  '4:00 AM',
  '4:30 AM',
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
]

const parseTimeToNumber = (time: string) => {
  let hour = 0
  let minute = 0
  let AM = 'AM'
  if (time.length === 8) {
    // ex: 12:00 AM
    hour = parseInt(time.slice(0, 2))
    minute = parseInt(time.slice(3, 5))
    AM = time.slice(6, 8)
  } else {
    // ex: 1:00 AM
    hour = parseInt(time.slice(0, 1))
    minute = parseInt(time.slice(2, 4))
    AM = time.slice(5, 7)
  }
  if (AM === 'AM' && hour === 12) {
    hour = 0
  }
  // parses time to match our 0-2400 scale for time
  return AM == 'AM' ? hour * 100 + minute : (hour + 12) * 100 + minute
}

export const parseTimefromNumber = (time: number) => {
  let meridian = 'AM'
  if (time == 0) {
    return '12:00 AM'
  }
  if (time > 1159) {
    meridian = 'PM'
  }
  if (time > 1259) {
    time = time - 1200
  }
  const timeString = String(time)
  let hours
  if (timeString.length > 3) {
    hours = timeString.slice(0, 2)
  } else {
    hours = timeString.slice(0, 1)
  }
  const minutes = timeString.slice(-2)
  if (Number(minutes) > 0) {
    return hours + ':' + minutes + ' ' + meridian
  }
  return hours + ':' + '00' + ' ' + meridian
}

const verifyToString = (bool: boolean) => {
  if (bool) {
    return 'Verification required'
  }
  return 'No Verification'
}

const emptyShift = {
  name: '',
  category: '',
  members: 1,
  hours: 0,
  possibleDays: [],
  timeWindowStartTime: '12:00 AM',
  timeWindowEndTime: '11:30 PM',
  verificationBuffer: 0,
  verification: 'Verification required',
  description: '',
  assignedUser: '',
}

const ShiftForm = ({
  setOpen,
  shiftId,
  isNewShift,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  shiftId?: string
  isNewShift: boolean
}) => {
  //* Get API helpers to create or update a shift
  const [
    addNewShift,
    {
      // isLoading: isLoadingNewShift,
      // isSuccess: isSuccessNewShift,
      // isError: isErrorNewShift,
      // error: errorNewShift,
    },
  ] = useAddNewShiftMutation()
  const [
    updateShift,
    {
      // isLoading: isLoadingUpdateShift,
      // isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const shift: Shift = useSelector(
    (state: RootState) =>
      selectShiftById('EUC')(state, shiftId as EntityId) as Shift
  )

  const onSubmit = async (
    values: FormikValues,
    formikBag: FormikHelpers<FormikValues>
  ) => {
    const {
      name,
      category,
      hours,
      possibleDays,
      timeWindowStartTime,
      timeWindowEndTime,
      verificationBuffer,
      verification,
      description,
    } = values

    const startTime = parseTimeToNumber(timeWindowStartTime)
    const endTime = parseTimeToNumber(timeWindowEndTime)

    let result
    const timeWindow = [startTime, endTime]
    const timeWindowDisplay = timeWindowStartTime + ' - ' + timeWindowEndTime
    const data = { data: {}, houseId: '', shiftId: '' }
    const verificationBool =
      verification === 'Verification required' ? true : false
    data.data = {
      name,
      category,
      hours,
      possibleDays,
      timeWindow,
      timeWindowDisplay,
      verificationBuffer,
      verificationBool,
      description,
    }
    data.houseId = 'EUC'
    data.shiftId = shiftId ? shiftId : ''
    // console.log('data: ', data)
    if (isNewShift || !shiftId) {
      result = await addNewShift(data)
    } else {
      result = await updateShift(data)
    }
    if (result) {
      console.log('success with shift: ', result)
    }

    formikBag.resetForm()
    setOpen(false)
  }

  return (
    <>
      <Formik
        validationSchema={ShiftSchema}
        initialValues={{
          name: shift ? shift.name : emptyShift.name,
          category: shift ? shift.category : emptyShift.category,
          members: 1,
          hours: shift ? shift.hours : emptyShift.hours,
          possibleDays: shift
            ? shift.possibleDays
              ? shift.possibleDays
              : []
            : emptyShift.possibleDays,
          timeWindowStartTime: shift
            ? parseTimefromNumber(shift.timeWindow[0])
            : emptyShift.timeWindowStartTime,
          timeWindowEndTime: shift
            ? parseTimefromNumber(shift.timeWindow[1])
            : emptyShift.timeWindowEndTime,
          verificationBuffer: shift
            ? shift.verificationBuffer
            : emptyShift.verificationBuffer,
          verification: shift
            ? verifyToString(shift.verification)
            : emptyShift.verification,
          description: shift ? shift.description : emptyShift.description,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.formField}>
              <Typography>Shift Name</Typography>
              <TextInput name="name" label="" />
            </div>

            <div className={styles.formField}>
              <Typography className={styles.label}>Category</Typography>
              <SelectInput
                name="category"
                label=""
                labelid="category"
                id="category"
                options={shiftCategories}
                multiselect={false}
              />
            </div>
            <div className={styles.flex}>
              <div className={styles.formField}>
                <Typography>Members</Typography>
                <TextInput name="members" label="" />
              </div>
              <div className={styles.formField}>
                <Typography>Value (hours)</Typography>
                <TextInput name="hours" label="" />
              </div>
            </div>
            <div className={styles.formField}>
              <Typography>Days (select as many as applicable)</Typography>
              <SelectInput
                name="possibleDays"
                label=""
                labelid="possibleDays"
                id="possibleDays"
                options={daysList}
                multiselect={true}
              />
            </div>
            <div className={styles.flex}>
              <div className={styles.formField}>
                <Typography>Start Time</Typography>
                <SelectInput
                  name="timeWindowStartTime"
                  label=""
                  labelid="timeWindowStartTime"
                  id="timeWindowStartTime"
                  options={timeWindows}
                  multiselect={false}
                />
              </div>
              <div className={styles.formField}>
                <Typography>End Time</Typography>
                <SelectInput
                  name="timeWindowEndTime"
                  label=""
                  labelid="timeWindowEndTime"
                  id="timeWindowEndTime"
                  options={timeWindows}
                  multiselect={false}
                />
              </div>
              <div className={styles.formField}>
                <Typography>Buffer Hours</Typography>
                <TextInput name="verificationBuffer" label="" />
              </div>
            </div>
            <div className={styles.formField}>
              <Typography>Verification</Typography>
              <SelectInput
                name="verification"
                label=""
                labelid="verification"
                id="verification"
                options={verificationOptions}
                multiselect={false}
              />
            </div>
            <div className={styles.formField}>
              <Typography>Description</Typography>
              <TextInput name="description" label="" />
            </div>
            <div className={styles.flex}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                className={styles.submit}
              >
                {isNewShift || !shiftId ? 'Submit' : 'Update'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => setOpen(false)}
                className={styles.clear}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ShiftForm
