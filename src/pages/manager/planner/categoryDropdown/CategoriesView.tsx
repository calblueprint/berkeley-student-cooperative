import { useEffect, useState } from 'react'
// import { addCategory } from '../../../../firebase/queries/house'
import { User } from '../../../../types/schema'
// import CategoriesDropdown from './CategoriesDropdown'
import Button from '@mui/material/Button'
import { Dialog, DialogContent, TextField, Typography } from '@mui/material'
import Icon from '../../../../assets/Icon'
import AddIcon from '@mui/icons-material/Add'
import {
  useGetHouseQuery,
  useUpdateHousesMutation,
} from '../../../../store/apiSlices/houseApiSlice'
import styles from './CategoriesView.module.css'
import CategoryTable from '../../../../components/ManagerComponents/CategoryTable/CategoryTable'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../../store/slices/authSlice'
const theme = createTheme({
  palette: {
    primary: {
      main: '#1B202D',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
})

// type CategoriesViewProps = {
//   houseID: string
// }

const CategoriesView = () => {
  /**
   * Displays the shift categories in a house and provides the ability to add a new category.
   * Each shift category is a drop-down, such that when clicked, it displays all of the shifts under that category.
   *
   * @param houseID - The ID of the house.
   * @returns CategoriesView
   */

  const authUser = useSelector(selectCurrentUser) as User

  const {
    data: dataHouse,
    isLoading: isHouseLoading,
    isSuccess: isHouseSuccess,
  } = useGetHouseQuery(authUser.houseID)

  const [updateHouse, { isLoading: isUpdating }] = useUpdateHousesMutation()

  // console.log("data", dataHouse, "is the Query loading:", isLoading, "Was the query successful:",
  // isSuccess, "is there an error:", isError,"error message:", error)
  // Retrieved house object
  // const [house, setHouse] = useState<House>()
  // Stores whether the modal to create a new category is opened
  const [isModalOpened, setIsModalOpened] = useState(false)
  // Stores the new category name
  const [newCategoryName, setNewCategoryName] = useState('')

  const [houseCategoryObject, setHouseCategoryObject] = useState<
    Record<string, string[]> | undefined
  >(undefined)

  useEffect(() => {
    if (isHouseSuccess) {
      console.log(dataHouse)
      setHouseCategoryObject(dataHouse.entities[authUser.houseID]?.categories)
    }
  }, [dataHouse, isHouseSuccess, authUser])

  // Opens modal
  const openModal = () => {
    setIsModalOpened(true)
  }

  // Closes the modal without pushing anything to firebase
  const closeModal = () => {
    setIsModalOpened(false)
    clearFields()
  }

  // Clears fields
  const clearFields = () => {
    setNewCategoryName('')
  }

  // Uploads the new category to Firebase if the category doesn't exist yet
  const uploadCategory = async () => {
    if (newCategoryName.length == 0) {
      console.log('Invalid Category Name length')
      return
    }
    if (houseCategoryObject && newCategoryName.length > 0) {
      let categories

      if (houseCategoryObject) {
        categories = { ...houseCategoryObject, [newCategoryName]: [] }
      } else {
        categories = { [newCategoryName]: [] }
      }
      const house = { categories }
      // console.log('[CategoriesView]:Categories Object: ', houseCategoryObject)
      // console.log(
      //   '[CategoriesView]:With new Category: ',
      //   authUser.houseID,
      //   house
      // )
      const data = { data: house, houseId: authUser.houseID }

      try {
        const payload = await updateHouse(data).unwrap()
        console.log('fulfilled', payload)
      } catch (error) {
        console.error('rejected', error)
      }
    }

    closeModal()
  }
  const buttonStyling = {
    backgroundColor: '#1B202D',
    borderRadius: 1,
    marginBottom: 2,
  }

  return (
    <div className={styles.categoryViewContainer}>
      <ThemeProvider theme={theme}>
        <Button
          onClick={openModal}
          color="secondary"
          sx={buttonStyling}
          className={styles.newCategory}
        >
          New Category
          <AddIcon sx={{ fontSize: 19, marginLeft: 0.5, paddingBottom: 0.2 }} />
        </Button>
      </ThemeProvider>
      {!isHouseLoading && houseCategoryObject ? (
        <CategoryTable categories={houseCategoryObject} />
      ) : (
        <div>
          {isHouseLoading && houseCategoryObject ? (
            <h1>Loading...</h1>
          ) : (
            <h1>No categories Exist in this house, add one now!</h1>
          )}
        </div>
      )}

      {isModalOpened && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={isModalOpened}
          onClose={closeModal}
          className={styles.dialog}
        >
          <DialogContent>
            <div className={styles.shiftBox}>
              <div className={styles.header}>
                <div className={styles.flex}>
                  <Typography className={styles.title} variant="h4">
                    Create Category
                  </Typography>
                  <Button onClick={closeModal} className={styles.close}>
                    <Icon type={'close'} />
                  </Button>
                </div>
                <hr />
              </div>
              <div className={styles.formField}>
                <div>
                  <Typography className={styles.name}>Category name</Typography>
                </div>
                <TextField
                  className={styles.textfield}
                  fullWidth
                  value={newCategoryName}
                  placeholder="Ex: Basement clean"
                  onChange={(event) => {
                    setNewCategoryName(event.target.value)
                  }}
                />
              </div>
              <div>
                <Button
                  onClick={uploadCategory}
                  className={styles.submit}
                  disabled={isUpdating}
                >
                  Save
                </Button>
                <Button onClick={clearFields} className={styles.clear}>
                  Clear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default CategoriesView
