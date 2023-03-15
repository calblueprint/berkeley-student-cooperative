import React from 'react'
// import ReactDOM from 'react-dom'
import { FieldHookConfig, useField } from 'formik'
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
} from '@mui/material'

type TextInputProps = {
  label: string
} & FieldHookConfig<string>

export const TextInput = ({ label, ...props }: TextInputProps) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)
  const showError = meta.touched && !!meta.error
  // React.useEffect(() => {
  //   if (field) console.log('Fields: ', field)
  //   if (meta) console.log('Meta: ', meta)
  //   if (props) console.log('Props: ', props)
  // }, [meta, field])
  return (
    <>
      <TextField
        {...field}
        label={label}
        error={showError}
        helperText={showError ? meta.error : ''}
        variant="outlined"
        fullWidth
        margin="normal"
        // rows={4} //field.name.includes('description') ? 4 : 4}
      />
    </>
  )
}

type SelectInputProps = {
  label: string
  labelid: string
  id?: string
  options: string[]
  multiselect?: boolean
} & FieldHookConfig<string>

export const SelectInput = ({
  label,
  labelid,
  id,
  ...props
}: SelectInputProps) => {
  const [field, meta] = useField({ ...props, type: 'select' })

  const showError = meta.touched && !!meta.error

  // React.useEffect(() => {
  //   if (field) console.log('Fields: ', field)
  //   if (meta) console.log('Meta: ', meta)
  //   if (props) console.log('Props: ', props)
  // }, [meta, field])

  const contentLabel = (
    <>
      <FormControl margin="dense" fullWidth error={showError}>
        <InputLabel id={labelid}>{label}</InputLabel>
        <Select
          id={id || props.name}
          labelId={labelid}
          label={label}
          // {...props}
          multiple={props.multiselect}
          {...field}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText>{showError ? meta.error : ''}</FormHelperText>
      </FormControl>
    </>
  )
  return contentLabel
}
