import React from 'react'
// import ReactDOM from 'react-dom'
import { useField } from 'formik'
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
} from '@mui/material'

export const TextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)
  return (
    <>
      <TextField
        id={props.id || props.name}
        name={props.name}
        label={label}
        variant="outlined"
        {...field}
        {...props}
      />
    </>
  )
}

export const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'select' })

  const contentLabel = (
    <>
      <FormControl {...props}>
        <InputLabel id={props.labelid}>{label}</InputLabel>
        <Select
          id={props.id || props.name}
          labelId={props.labelid}
          label={label}
          {...props}
          {...field}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText>{props?.helpertext}</FormHelperText>
      </FormControl>
    </>
  )
  const contentUnLabel = (
    <>
      <FormControl {...props}>
        <Select
          // value={age}
          // onChange={handleChange}
          // displayEmpty
          // inputProps={{ 'aria-label': 'Without label' }}
          {...props}
          {...field}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText>{props?.helpertext}</FormHelperText>
      </FormControl>
    </>
  )
  return props?.labelid ? contentLabel : contentUnLabel
}
