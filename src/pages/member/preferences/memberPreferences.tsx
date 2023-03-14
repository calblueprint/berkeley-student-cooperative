import * as React from 'react'
import { useState, useEffect } from 'react'
import { getCategories, addCategory, removeCategory, updateCategory } from '../../../firebase/queries/house'
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
import { Shift } from '../../../types/schema'

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
  const handlePrefButton = (prefValue: string) => {
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
  const [houseCategories, setHouseCategories] = useState<string[][]>()
  //const [preferID, setPreferID] = useState<string>()

  const fakeShift: Shift = {
    shiftID:"pickCat",
    name: "Pick Up Tory",
    description: "Folasade will pick up Tory from Jennifer",
    possibleDays: ["Thursday"],
    numOfPeople: 1,
    timeWindow: [12, 14],
    assignedDay: "Thursday",
    hours: 2,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Pick Up Cat"
  }

  const fs2: Shift = {
    shiftID:"DKFJALSDdkfjd",
    name: "Drive Back to Berkeley",
    description: "Folasade will drive up Tory from San Francisco",
    possibleDays: ["Thursday"],
    numOfPeople: 1,
    timeWindow: [1600, 1800],
    assignedDay: "Thursday",
    hours: 1,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Pick Up Cat"
  }

  const fs3: Shift = {
    shiftID:"KLASKDJFAK",
    name: "Get Tory Settled",
    description: "Folasade will get Tory settled in",
    possibleDays: ["Thursday, Friday, Saturday"],
    numOfPeople: 1,
    timeWindow: [1600, 1800],
    assignedDay: "Friday",
    hours: 12,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Pick Up Cat"
  }
  const fs4: Shift = {
    shiftID:"DKJFALKSDJFLAKJ",
    name: "Feed Tory",
    description: "Folasade will feed Tory dinner",
    possibleDays: ["Thursday, Friday, Saturday"],
    numOfPeople: 1,
    timeWindow: [1200, 1800],
    assignedDay: "Thursday",
    hours: 1,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Cooking"
  }
  const fs5: Shift = {
    shiftID:"SKDFADSF",
    name: "Tory's Laundry",
    description: "Folasade will feed Tory dinner",
    possibleDays: ["Thursday, Friday, Saturday"],
    numOfPeople: 1,
    timeWindow: [1200, 1800],
    assignedDay: "Thursday",
    hours: 1,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Laundry"
  }
  const fs22: Shift = {
    shiftID:"DKFAJSDLKFJAS",
    name: "Get Tory",
    description: "Folasade will get Tory settled in",
    possibleDays: ["Thursday, Friday, Saturday"],
    numOfPeople: 1,
    timeWindow: [1600, 1800],
    assignedDay: "Friday",
    hours: 12,
    verification: false,
    usersAssigned: [], 
    timeWindowDisplay: "",
    verificationBuffer: 1, 
    category: "Pick Up Cat"
  }

  //gets all categories from the backend
  //Euclid is hardcoded in so info appears, but will depend on user.
  useEffect(() => {
    
    updateCategory('CLO', fs22).then(() => {
      getCategories('CLO').then((category) => {
      //holds categories in houseCategories useState
      //setHouseCategories(Object.entries(category))
      console.log("CURRENT FIREBASE", category)
    })
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
