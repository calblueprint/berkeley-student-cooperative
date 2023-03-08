import { Formik, Form } from 'formik'
import { Stack, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'

import dayjs, { Dayjs } from 'dayjs'
import * as Yup from 'yup'
import { TextInput, SelectInput } from '../../shared/forms/CustomFormikFields'
import {
  selectShiftById,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
} from '../../../store/apiSlices/shiftApiSlice'
// import { getCategories } from '../../../firebase/queries/house'
import { useSelector } from 'react-redux'
import React from 'react'
import { formatMilitaryTime } from '../../../utils/utils'
import { RootState } from '../../../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { Shift } from '../../../types/schema'
// import { useUserContext } from '../../../context/UserContext'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const ShiftSchema = Yup.object({
  name: Yup.string(),
  // .required('Name is required')
  // .min(1, 'Name must have at least 1 characters'),
  description: Yup.string(),
  possibleDays: Yup.array().of(Yup.string()),
  timeWindowStartTime: Yup.date(),
  timeWindowEndTime: Yup.date(),
  category: Yup.string(), //.required('Cagegory is required'),
  hours: Yup.number(), //.required('Hours credit is required'),
  verificationBuffer: Yup.number(),
  assignedUser: Yup.string(),
})

const daysList = [
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

// {

//   // Name of the shift
//   name: string

//   description: string
//   // Possible days that the shift can be done on
//   possibleDays: string[]
//   // Time window that this shift must be done in [startTime, endTime]
//   timeWindow: {startTime: string, endTime: string}
//   // property to display timeWindow
//   timeWindowDisplay: string
//   // Day that the shift is assigned
//   assignedDay: string
//   // Hours earned for a user
//   hours: number
//   // Number of hours since end time that you are allowed to verify a shift for
//   verificationBuffer: number
//   // Users assigned to the shift
//   usersAssigned: string[]
//   // Category of work that the shift belongs to
//   category: string
// }

const Shift = {
  name: '',
  category: '',
  possibleDays: [],
  timeWindowStartTime: dayjs(),
  timeWindowEndTime: dayjs(),
  hours: 0,
  despription: '',
  verificationBuffer: 0,
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
  // const { authUser, house } = useUserContext()
  // const [currentShift, setCurrentShift] = React.useState(Shift)

  // const shiftCategories = getCategories(house.houseID) //TODO: use redux api slice once implemented

  //* Get API helpers to create or update a shift
  const [
    addNewShift,
    {
      isLoading: isLoadingNewShift,
      isSuccess: isSuccessNewShift,
      isError: isErrorNewShift,
      error: errorNewShift,
    },
  ] = useAddNewShiftMutation()
  const [
    updateShift,
    {
      isLoading: isLoadingUpdateShift,
      isSuccess: isSuccessUpdateShift,
      isError: isErrorUpdateShift,
      error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const shift: Shift = useSelector((state: RootState) =>
    selectShiftById('EUC')(state, shiftId as EntityId)
  )

  const onSubmit = async (
    values: {
      name: string
      category: string
      hours: number
      description: string
      possibleDays: string[]
      timeWindowStartTime: Dayjs
      timeWindowEndTime: Dayjs
      verificationBuffer: number
      //   assignedUser: string
    },
    formikBag: any
  ) => {
    console.log('Submiting ShiftForm: ', values)
    const {
      name,
      category,
      hours,
      description,
      possibleDays,
      timeWindowStartTime,
      timeWindowEndTime,
      verificationBuffer,
      //   assignedUser,
    } = values

    const num = 1900
    const startTime = Number(timeWindowStartTime.format('HHmm'))
    const endTime = Number(timeWindowEndTime.format('HHmm'))

    console.log(dayjs('1900', 'HHmm').format('HHmm'))
    console.log(dayjs(num.toString(), 'HHmm'))

    // const dayString = possibleDays.join('')
    let result
    const timeWindow = [startTime, endTime]
    const timeWindowDisplay =
      formatMilitaryTime(startTime) + ' - ' + formatMilitaryTime(endTime)
    const data = { data: {}, houseId: '', shiftId: '' }
    data.data = {
      name,
      category,
      hours,
      possibleDays,
      description,
      timeWindow,
      verificationBuffer,
      timeWindowDisplay,
      //   assignedUser,

      // created_by: '63d0eca7e8e159c2bf0a57e6',
    }
    data.houseId = 'EUC'
    data.shiftId = shiftId ? shiftId : ''
    console.log('data: ', data)
    if (isNewShift || !shiftId) {
      result = await addNewShift(data)
    } else {
      result = await updateShift(data)
    }
    console.log(result)

    // formikBag.resetForm()
    setOpen(false)
  }

  React.useEffect(() => {
    console.log(shift)
  }, [shift])

  return (
    <>
      <Formik
        validationSchema={ShiftSchema}
        initialValues={{
          name: shift ? shift.name : Shift.name,
          category: shift ? shift.category : Shift.category,
          hours: shift ? shift.hours : Shift.hours,
          timeWindowStartTime: shift
            ? dayjs() //shift.timeWindow[0].toString(), 'HHmm') // TODO: convert military time to type TimePicker
            : Shift.timeWindowStartTime,
          timeWindowEndTime: shift
            ? dayjs() //shift.timeWindow[1].toString(), 'HHmm') // TODO: convert military time to type TimePicker
            : Shift.timeWindowEndTime,
          possibleDays: shift ? shift.possibleDays : Shift.possibleDays,
          description: shift ? shift.description : Shift.despription,
          verificationBuffer: shift
            ? shift.verificationBuffer
            : Shift.verificationBuffer,
          //   assignedUser: shift
          //     ? (shift.assignedUser as string)
          //     : Shift.assignedUser,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, touched, errors, values, setFieldValue }) => (
          <Form>
            <TextInput
              name="name"
              label="Shift Name"
              margin="normal"
              fullWidth
              value={values.name}
              error={touched.name && errors.name ? true : false}
              helperText={touched.name && errors.name}
            />

            <SelectInput
              name="category"
              label="Category"
              margin="dense"
              labelid="category"
              id="category"
              fullWidth
              value={values.category}
              error={touched.category && errors.category ? true : false}
              helpertext={touched.category && errors.category}
              options={shiftCategories}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                label="Start Window Time"
                minutesStep={30}
                value={values.timeWindowStartTime}
                onChange={(newValue) =>
                  setFieldValue('timeWindowStartTime', newValue)
                }
                // defaultValue={dayjs('2022-04-17T15:30')}
              />
              <MobileTimePicker
                label="End Window Time"
                minutesStep={30}
                value={values.timeWindowEndTime}
                onChange={(newValue) => {
                  // console.log('endWindowTime', newValue?.toLocaleString())
                  setFieldValue('timeWindowEndTime', newValue)
                }}
                // defaultValue={dayjs('2022-04-17T15:30')}
              />
            </LocalizationProvider>

            <TextInput
              name="hours"
              label="Credit Hours For Shift"
              margin="normal"
              fullWidth
              value={values.hours}
              error={touched.hours && errors.hours ? true : false}
              helperText={touched.hours && errors.hours}
            />

            <TextInput
              name="verificationBuffer"
              label="Buffer Hours"
              margin="normal"
              fullWidth
              value={values.verificationBuffer}
              error={
                touched.verificationBuffer && errors.verificationBuffer
                  ? true
                  : false
              }
              helperText={
                touched.verificationBuffer && errors.verificationBuffer
              }
            />

            <SelectInput
              name="possibleDays"
              label="Posible Days"
              margin="dense"
              labelid="possibleDays"
              id="possibleDays"
              fullWidth
              value={values.possibleDays as Array<string>}
              error={touched.possibleDays && errors.possibleDays ? true : false}
              helpertext={touched.possibleDays && errors.possibleDays}
              options={daysList}
              multiple
            />

            <TextInput
              name="description"
              label="Description"
              margin="normal"
              fullWidth
              multiline
              rows={4}
              value={values.description}
              error={touched.description && errors.description ? true : false}
              helperText={touched.description && errors.description}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isNewShift || !shiftId ? 'Submit' : 'Update'}
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

export default ShiftForm
