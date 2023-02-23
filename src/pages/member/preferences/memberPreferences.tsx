import * as React from 'react'
import { useState, useEffect } from 'react'
import { getCategories } from '../../../firebase/queries/house'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
} from '@mui/material'
import styles from './memberPreferences.module.css'

const PreferButton = () => {
  /**
   * Updates a user's preferences in the firebase.
   * @remark This method should be called whenever a button on the preference page is pressed.
   * @remark Logic pertaining to authContext hasn't been added yet, currently working on it
   * @remark Also please ignore styling, I am working on the logic at the moment.
   *
   * @public
   *
   */
  const handlePrefButton = (prefValue: String) => {
    if (prefValue == 'dislike') {
      console.log('dislike pushed')
    } else if (prefValue == 'neutral') {
      console.log('neutral pushed')
    } else if (prefValue == 'prefer') {
      console.log('prefer pushed')
    }
  }

  return (
    //button group that puts all buttons in one component, just to make code less redundant
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button onClick={() => handlePrefButton('dislike')}>Dislike</Button>
      <Button onClick={() => handlePrefButton('neutral')}>Neutral</Button>
      <Button onClick={() => handlePrefButton('prefer')}>Prefer</Button>
    </ButtonGroup>
  )
}

const MemberPreferences = () => {
  //array that holds the categories of particular house
  const [houseCategories, setHouseCategories] = useState<String[][]>()
  const [preferID, setPreferID] = useState<String>()

  //gets all categories from the backend
  //Euclid is hardcoded in so info appears, but will depend on user.
  useEffect(() => {
    getCategories('EUC').then((category) => {
      //holds categories in houseCategories useState
      setHouseCategories(Object.entries(category))
    })
  }, [])

  return (
    <div className={styles.memberPrefPage}>
      {/* title of page */}
      <div className={styles.title}>
        <Typography className={styles.prevPage} variant="h2">
          Settings/
        </Typography>
        <Typography className={styles.taskTitle} variant="h2">
          Task Preferences
        </Typography>
      </div>
      <div className={styles.prefTables}>
        {/* iterates through house categories and creates a table for each category */}

        {houseCategories?.map((value, key) => {
          return (
            <div key={key} className={styles.spefTable}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          backgroundColor: 'lightblue',
                          fontSize: '19pt',
                        }}
                        className="category"
                      >
                        {value[0]}
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: 'lightblue' }}
                        align="right"
                      >
                        <PreferButton />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {/* for each category it iterates through each shift to display */}
                  <TableBody>
                    {Object.entries(value[1]).map((value, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{value[1]}</TableCell>
                          <TableCell align="right">
                            <PreferButton />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MemberPreferences
