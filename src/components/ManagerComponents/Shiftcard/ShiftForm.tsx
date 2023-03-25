import { Formik, Form, FormikHelpers, FormikValues } from 'formik'
import { Stack, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'

import dayjs from 'dayjs'
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
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  description: Yup.string(),
  possibleDays: Yup.array().of(Yup.string()),
  timeWindowStartTime: Yup.date().required('Start time is required'),
  timeWindowEndTime: Yup.date().required('End time is required'),
  category: Yup.string().required('Cagegory is required'),
  hours: Yup.number().required('Hours credit is required'),
  verificationBuffer: Yup.number(),
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

const emptyShift = {
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
    //  : {
    //   name: string
    //   category: string
    //   hours: number
    //   description: string
    //   possibleDays: string[]
    //   timeWindowStartTime: Dayjs
    //   timeWindowEndTime: Dayjs
    //   verificationBuffer: number
    // },
    formikBag: FormikHelpers<FormikValues>
  ) => {
    // console.log('Submiting ShiftForm: ', values)
    const {
      name,
      category,
      hours,
      description,
      possibleDays,
      timeWindowStartTime,
      timeWindowEndTime,
      verificationBuffer,
    } = values

    const startTime = Number(timeWindowStartTime.format('HHmm'))
    const endTime = Number(timeWindowEndTime.format('HHmm'))

    // console.log(dayjs('1900', 'HHmm').format('HHmm'))
    // const num = 1900
    // console.log(dayjs(num.toString(), 'HHmm'))

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

  // React.useEffect(() => {
  //   console.log('This is the selected shift', shift)
  // }, [shift])

  return (
    <>
      <Formik
        validationSchema={ShiftSchema}
        initialValues={{
          name: shift ? shift.name : emptyShift.name,
          category: shift ? shift.category : emptyShift.category,
          hours: shift ? shift.hours : emptyShift.hours,
          timeWindowStartTime: shift
            ? dayjs(shift.timeWindow[0].toString(), 'HHmm') // TODO: convert military time to type TimePicker
            : emptyShift.timeWindowStartTime,
          timeWindowEndTime: shift
            ? dayjs(shift.timeWindow[1].toString(), 'HHmm') // TODO: convert military time to type TimePicker
            : emptyShift.timeWindowEndTime,
          possibleDays: shift
            ? shift.possibleDays
              ? shift.possibleDays
              : []
            : emptyShift.possibleDays,
          description: shift ? shift.description : emptyShift.despription,
          verificationBuffer: shift
            ? shift.verificationBuffer
            : emptyShift.verificationBuffer,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            
            <TextInput name="name" label="Shift Name" />

            <SelectInput
              name="category"
              label="Category"
              labelid="category"
              id="category"
              options={shiftCategories}
              multiselect={false}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                label="Start Window Time"
                minutesStep={30}
                value={values.timeWindowStartTime}
                onChange={(newValue) =>
                  setFieldValue('timeWindowStartTime', newValue)
                }
              />
              <MobileTimePicker
                label="End Window Time"
                minutesStep={30}
                value={values.timeWindowEndTime}
                onChange={(newValue) => {
                  setFieldValue('timeWindowEndTime', newValue)
                }}
              />
            </LocalizationProvider>

            <TextInput name="hours" label="Credit Hours For Shift" />

            <TextInput name="verificationBuffer" label="Buffer Hours" />

            <SelectInput
              name="possibleDays"
              label="Posible Days"
              labelid="possibleDays"
              id="possibleDays"
              options={daysList}
              multiselect={true}
            />

            <TextInput name="description" label="Description" />
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
