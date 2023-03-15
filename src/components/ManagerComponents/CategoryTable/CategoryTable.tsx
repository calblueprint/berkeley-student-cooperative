import { Paper, IconButton, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useState, useEffect } from 'react'
import { getCategories } from '../../../firebase/queries/house'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import styles from './CategoryTable.module.css'
import { RootState } from '../../../store/store'
import {
  selectShiftById,
  useGetShiftsQuery,
} from '../../../store/apiSlices/shiftApiSlice'
import { EntityId } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Shift, User } from '../../../types/schema'
import { selectCurrentUser } from '../../../store/slices/authSlice'

type ShiftNameRowProps = {
  shiftID: string
}
const ShiftNameRow: React.FC<ShiftNameRowProps> = ({
  shiftID,
}: ShiftNameRowProps) => {
  // const CurrShift = (shiftID: EntityId) => {
  //     useSelector(
  //     (state: RootState) =>
  //     selectShiftById('EUC')(state, shiftID)) as Shift
  // }
  console.log('hello')
  const currShift = useSelector((state: RootState) =>
    selectShiftById('EUC')(state, shiftID as EntityId)
  ) as Shift
  console.log('currShift', currShift, 'value', shiftID)
  return (
    <TableRow>
      <TableCell sx={{ fontSize: 18, marginLeft: 28 }}>
        {currShift?.name}
      </TableCell>
    </TableRow>
  )
}

type CategoryTableProps = {
  categoriesArray: string[]
}
const CategoryTable: React.FC<CategoryTableProps> = ({
  categoriesArray,
}: CategoryTableProps) => {
  const [houseCategories, setHouseCategories] = useState<string[] | undefined>(
    undefined
  )

  const authUser = useSelector(selectCurrentUser) as User

  const {
    data: shiftsData,
    isLoading,
    isSuccess,
    isError,
  } = useGetShiftsQuery(authUser.houseID)

  useEffect(() => {
    setHouseCategories(categoriesArray)
  }, [categoriesArray])

  if (isLoading) {
    return <div>Is Loding...</div>
  } else if (isError) {
    return <div>Error Getting Shifts</div>
  } else if (isSuccess && shiftsData) {
    return (
      <div>
        {houseCategories?.map((category, index) => {
          return (
            <div key={index}>
              <IndividualCategory category={category} />
              <br />
            </div>
          )
        })}
      </div>
    )
  }
}
type IndividualCategoryProps = {
  category: any
}
const IndividualCategory: React.FC<IndividualCategoryProps> = ({
  category,
}: IndividualCategoryProps) => {
  // Stores whether the dropdown has been expanded / collapsed
  const [isExpanded, setIsExpanded] = useState(false)

  // Expands / collapses the dropdown
  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  const shiftNumDisplay = {
    fontSize: 18,
    backgroundColor: '#EFEFEF',
    padding: 1,
    marginBottom: 1,
    marginLeft: 1,
    borderRadius: 1,
  }

  const shiftItems = category[1]

  //     const shiftObject = useSelector((state: RootState) =>
  //     selectShiftById(houseID)(state, shiftID as EntityId) as Shift
  //   )

  return (
    <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: 32 }}>
              <IconButton onClick={handleExpand}>
                {isExpanded ? (
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: 32, color: 'black' }}
                  />
                ) : (
                  <KeyboardArrowRightIcon
                    sx={{ fontSize: 32, color: 'black' }}
                  />
                )}
              </IconButton>
              {category[0]}{' '}
              {shiftItems.length == 1 ? (
                <Typography sx={shiftNumDisplay} className={styles.numShifts}>
                  1 shift
                </Typography>
              ) : (
                <Typography sx={shiftNumDisplay} className={styles.numShifts}>
                  {shiftItems.length} shifts
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isExpanded &&
            shiftItems?.map((value) => {
              return <ShiftNameRow shiftID={value} key={value} />
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CategoryTable
