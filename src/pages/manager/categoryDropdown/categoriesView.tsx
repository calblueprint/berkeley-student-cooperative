import { useEffect, useState } from 'react'
import {
  addCategory,
  getHouse,
} from '../../../firebase/queries/house'
import { House } from '../../../types/schema'
import CategoriesDropdown from './categoriesDropdown'
import Button from '@mui/material/Button'
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material'
import Icon from '../../../assets/Icon'

import styles from './CategoriesView.module.css'

type CategoriesViewProps = {
  houseID: string
}

const CategoriesView: React.FC<CategoriesViewProps> = ({
  houseID,
}: CategoriesViewProps) => {
  /**
   * Displays the shift categories in a house and provides the ability to add a new category.
   * Each shift category is a drop-down, such that when clicked, it displays all of the shifts under that category.
   *
   * @param houseID - The ID of the house.
   * @returns CategoriesView
   */

  // Retrieved house object
  const [house, setHouse] = useState<House>()
  // Stores whether the modal to create a new category is opened
  const [isModalOpened, setIsModalOpened] = useState(false)
  // Stores the new category name
  const [newCategoryName, setNewCategoryName] = useState('')

  // Retrieves the house object given the houseID
  useEffect(() => {
    const retrieveHouse = async () => {
      const h = await getHouse(houseID)
      setHouse(h)
    }
    retrieveHouse()
  }, [houseID])

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
    }
    if (house !== undefined && newCategoryName.length > 0) {
      const successful = await addCategory(houseID, newCategoryName)
      if (successful) {
        house.categories.set(newCategoryName, new Map<string, string>())
        setHouse(house)
      }
    }
    closeModal()
  }
  
  return (
    <div className={styles.categoryViewContainer}>
      <Button onClick={openModal} id={styles.newCategory}>
        New Category
      </Button>
      <TableContainer>
        <Table>
          <TableBody>
            {house &&
              Array.from(house.categories.keys())
                .sort()
                .map((key, index) => (
                  <CategoriesDropdown
                    key={index}
                    mapKey={key}
                    categoryMap={house.categories.get(key)}
                  ></CategoriesDropdown>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
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
                <Button onClick={uploadCategory} className={styles.submit}>
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
