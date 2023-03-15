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

export const TextInput = ({
  name,
  label,
  ...props
}: {
  name: string
  label: string
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [field, meta] = useField(props as string | FieldHookConfig<any>)
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
        name={name}
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

export const SelectInput = ({
  name,
  label,
  labelid,
  id,
  multiselect,
  options,
  ...props
}: {
  name: string
  label: string
  labelid: string
  id: string
  multiselect: boolean
  options: string[]
}) => {
  const [field, meta] = useField({ ...props, type: 'select' } as
    | string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | FieldHookConfig<any>)

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id={id || name}
          labelId={labelid}
          label={label}
          // {...props}
          multiple={multiselect}
          {...field}
        >
          {options.map((option) => (
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
  // const contentUnLabel = (
  //   <>
  //     <FormControl {...props}>
  //       <Select
  //         // value={age}
  //         // onChange={handleChange}
  //         // displayEmpty
  //         // inputProps={{ 'aria-label': 'Without label' }}
  //         {...props}
  //         {...field}
  //       >
  //         {props.options.map((option) => (
  //           <MenuItem key={option} value={option}>
  //             {option}
  //           </MenuItem>
  //         ))}
  //       </Select>

  //       <FormHelperText>{props?.helpertext}</FormHelperText>
  //     </FormControl>
  //   </>
  // )
  // return labelid ? contentLabel : contentUnLabel
}
