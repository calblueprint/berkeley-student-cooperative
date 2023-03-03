import { Formik, Form } from 'formik'
import { Stack, Button } from '@mui/material'
import * as Yup from 'yup'
import {
  TextInput,
  SelectInput,
} from '../../shared/tables/customFormikFields/CustomFormikFields'
import {
  selectShiftById,
  useAddNewShiftMutation,
  useUpdateShiftMutation,
} from '../../../store/apiSlices/shiftApiSlice'
import { getCategories } from '../../../firebase/queries/house'
import { useSelector } from 'react-redux'
import { useUserContext } from '../../../context/UserContext'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const ShiftSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  category: Yup.string()
    .required('Cagegory is required')
    .min(3, 'Last name must have at least 3 characters'),
  credit_hours: Yup.number().required('Hours credit is required'),
  posible_days: Yup.array().of(Yup.string()),
  description: Yup.string(),
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

const Shift = {
  name: '',
  category: '',
  posible_days: [],
  credit_hours: '',
  despription: '',
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
  const { authUser, house } = useUserContext()
  const [currentShift, setCurrentShift] = React.useState(Shift)

  const shiftCategories = getCategories(house.houseID) //TODO: use redux api slice once implemented

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

  const shift = useSelector((state) =>
    selectShiftById(state, shiftId ? shiftId : '')
  )

  React.useEffect(() => {
    if (shift) {
      setCurrentShift(shift)
      console.log('Shift: ', shift)
    }
  }, [shift])

  const onSubmit = async (values, formikBag) => {
    const { name, category, credit_hours, day, description, posible_days } =
      values
    console.log(values)
    const dayString = posible_days.join('')
    let result
    if (isNewShift || !shiftId) {
      result = await addNewShift({
        name,
        category,
        credit_hours,
        posible_days,
        description,
        created_by: '63d0eca7e8e159c2bf0a57e6',
      })
    } else {
      result = await updateShift({
        id: taskId,
        name,
        category,
        credit_hours,
        posible_days,
        description,
      })
    }
    console.log(result)

    // formikBag.resetForm()
    setOpen(false)
  }

  return (
    <>
      <Formik
        validationSchema={TaskSchema}
        initialValues={{
          name: task ? task.name : Task.name,
          category: task ? task.category : Task.category,
          credit_hours: task ? task.credit_hours : Task.credit_hours,
          posible_days: task ? task.posible_days : Task.posible_days,
          description: task ? task.description : Task.posible_days,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, touched, errors, values }) => (
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

            <TextInput
              name="credit_hours"
              label="Credit Hours For Shift"
              margin="normal"
              fullWidth
              value={values.credit_hours}
              error={touched.credit_hours && errors.credit_hours ? true : false}
              helperText={touched.credit_hours && errors.credit_hours}
            />

            <SelectInput
              name="posible_days"
              label="Day"
              margin="dense"
              labelid="posible_days"
              id="posible_days"
              fullWidth
              value={values.posible_days}
              error={touched.posible_days && errors.posible_days ? true : false}
              helpertext={touched.posible_days && errors.posible_days}
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
                {isNewTask || !taskId ? 'Submit' : 'Update'}
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

export default TaskForm
