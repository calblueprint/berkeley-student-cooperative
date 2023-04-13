import { Box, Button, Stack } from '@mui/material'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { SelectInput } from '../../../components/shared/forms/CustomFormikFields'
import styles from './AvailabilityTabContent.module.css'

const daysList = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]
  
const AddAvailabilitySchema = Yup.object({
    startDay: Yup.string(),
    timeWindowStartTime: Yup.date().required('Start time is required'),
    endDay: Yup.string(),
    timeWindowEndTime: Yup.date().required('End time is required'),
})
const AddAvailabilityForm = ({
    setOpen,
    addAvailability
} : {
    setOpen: (value: React.SetStateAction<boolean>) => void
    addAvailability: (startTime: number, endTime: number, startDay: string, endDay: string) => void
}) => {

    const onSubmit = async (values: {
        startDay: string, 
        timeWindowStartTime: dayjs.Dayjs,
        endDay: string,
        timeWindowEndTime: dayjs.Dayjs
    },
    formikBag: FormikHelpers<any>
    ) => {
        const {
            startDay,
            timeWindowStartTime,
            endDay,
            timeWindowEndTime
        } = values;
        const convertedStartTime = Number(timeWindowStartTime.format('HHmm'))
        const convertedEndTime = Number(timeWindowEndTime.format('HHmm'))
        let dayOfWeekStart = daysList.indexOf(startDay);
        let dayOfWeekEnd = daysList.indexOf(endDay);
        if (dayOfWeekStart > dayOfWeekEnd) {
            // error
            return;
        }
        if (dayOfWeekStart == dayOfWeekEnd && convertedStartTime >= convertedEndTime) {
            return;
        }
        await addAvailability(convertedStartTime, convertedEndTime, startDay, endDay);
        setOpen(false);
    }
    return (
        <div>
            <Formik
                validationSchema = {AddAvailabilitySchema}
                initialValues = {{
                    startDay: "Monday",
                    timeWindowStartTime: dayjs('0', 'HHmm'),
                    endDay: "Monday",
                    timeWindowEndTime: dayjs('0', 'HHmm')
                }}
                onSubmit = {onSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                        <h1>From</h1>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <SelectInput
                                name="startDay"
                                label="Day"
                                labelid="startDay"
                                id="startDay"
                                options={daysList}
                                multiselect={false}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileTimePicker
                                    label="Start Time"
                                    minutesStep={30}
                                    value={values.timeWindowStartTime}
                                    onChange={(newValue) =>
                                    setFieldValue('timeWindowStartTime', newValue)
                                    }
                                />
                            </LocalizationProvider>
                        </Stack>
                        <h1>To</h1>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <SelectInput
                                name="endDay"
                                label="Day"
                                labelid="endDay"
                                id="endDay"
                                options={daysList}
                                multiselect={false}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileTimePicker
                                    label="End Time"
                                    minutesStep={30}
                                    value={values.timeWindowEndTime}
                                    onChange={(newValue) =>
                                    setFieldValue('timeWindowEndTime', newValue)
                                    }
                                />
                            </LocalizationProvider>
                        </Stack>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            className = {styles.float}
                        >
                            Save
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddAvailabilityForm;