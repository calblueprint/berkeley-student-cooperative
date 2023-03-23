import { Paper, IconButton, Typography, withTheme, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useState, Key, useEffect } from 'react'
import Button from '@mui/material/Button'
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
import { Shift, User, House } from '../../../types/schema'
import { selectCurrentUser } from '../../../store/slices/authSlice'
import {selectHouseById, useUpdateHousesMutation} from '../../../store/apiSlices/houseApiSlice'


const CategoryTable = ({
  categories,
  deleteCategory
}: {
  categories: Record<string, string[]>,
  deleteCategory: any
}) => {
  const authUser = useSelector(selectCurrentUser) as User

  // const [houseCategories, setHouseCategories] = useState<
  //   Record<string, string[]> | undefined
  // >(undefined)

  const {
    data: shiftsData,
    isLoading,
    isSuccess,
    isError,
  } = useGetShiftsQuery(authUser.houseID)



  if (isLoading) {
    return <div>Is Loading...</div>
  } else if (isError) {
    return <div>Error Getting Shifts</div>
  } else if (isSuccess && shiftsData) {
    return (
      <div>
        {categories
          ? Object.entries(categories).map((category, index) => (
              <div key={index}>
                <IndividualCategory deleteCategory={deleteCategory} category={category} />
                <br />
              </div>
            ))
          : null}
      </div>
    )
  } else {
    return <></>
  }
}
type IndividualCategoryProps = {
  category: [string, string[]] //Record<string, string[]>
  deleteCategory: any
}
const IndividualCategory: React.FC<IndividualCategoryProps> = ({
  category,
  deleteCategory
}: IndividualCategoryProps) => {
  // Stores whether the dropdown has been expanded / collapsed
  const [isExpanded, setIsExpanded] = useState(false)

  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }



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
  const buttonStyling = {
    backgroundColor: '#1B202D',
    borderRadius: 20,
    marginBottom: 2,
    color: 'white',
  }

  
  const shiftItems = category[1]

  

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
              {category[0] != 'Uncategorized' ? 
                <Button className="unassignBtn" sx={buttonStyling} onClick={handleOpen}>Uncategorized</Button>
                : <div></div>
                }
            </TableCell>
          </TableRow>
        </TableHead>
        <WarningDialog  deleteCategory={deleteCategory} unassignShifts={shiftItems} open={open} handleClose={handleClose} setOpen={setOpen} />
        <TableBody>
          {isExpanded &&
            shiftItems?.map((value: Key | null | undefined) => {
              return <ShiftNameRow shiftID={value as string} key={value} />
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}  
  type WarningDialogProps = {
    unassignShifts: string[], 
    open: boolean,
    handleClose: any,
    setOpen: any
    deleteCategory: any
}
const WarningDialog : React.FC<WarningDialogProps> = ({
    unassignShifts,
    deleteCategory,
    open, 
    setOpen,
    handleClose
}: WarningDialogProps) => {
      const [updateHouse] = useUpdateHousesMutation()
    //   await updateHouse({houseId: "EUC", data: {
    //     address: "new"
    //   }})
    const houseId = 'EUC';
    const currHouse = useSelector((state: RootState) =>
      selectHouseById('EUC')(state, houseId as EntityId)
    ) as House

    const updateFBCategories = () => {
        const updateHouseInfo = {
            houseId: "EUC", 
            data: {
                categories: "new"
            }
        }
        updateHouse(updateHouseInfo).then(() => {
            setOpen(false)
        })
        
    }
    return (
        <div>
    
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
            {"Are You Sure You Want To Remove These Shifts From This Category?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            You Will Not Be Able To Undo This Action.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={updateFBCategories} >
                Agree
            </Button>
            </DialogActions>
            </Dialog>
        </div>
    )
}
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
    // console.log('hello')
    const currShift = useSelector((state: RootState) =>
      selectShiftById('EUC')(state, shiftID as EntityId)
    ) as Shift
    // console.log('currShift', currShift, 'value', shiftID)
    return (
      <TableRow>
        <TableCell sx={{ fontSize: 18, marginLeft: 28 }}>
          {currShift?.name}
        </TableCell>
      </TableRow>
    )
  }


  

export default CategoryTable
