import * as React from 'react';
import {useState, useEffect} from 'react';
import { getCategories } from '../../firebase/queries/house';
import { getAllShiftsInCategory } from '../../firebase/queries/shift';
import {Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, ButtonGroup} from '@mui/material';
import styles from './memberPreferences.module.css'

const PreferButton = () => {
    //logic needs to be added, but something will be done when a certain button is pressed
    const handlePrefButton = (prefValue : String) => {
        if (prefValue == 'dislike'){
            console.log("dislike pushed")
        } else if (prefValue == 'neutral') {
            console.log("neutral pushed")
        } else if (prefValue == 'prefer') {
            console.log("prefer pushed")
        }
    }
    
    return (
        //button group that puts all buttons in one component, just to make code less redundant
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => handlePrefButton('dislike')}>Dislike</Button>
            <Button onClick={() => handlePrefButton('prefer')}>Prefer</Button>
        </ButtonGroup>
    );
};

const PreferCategoryButton = () => {
    //logic needs to be added, but something will be done when a certain button is pressed
    const handlePrefButton = (prefValue : String) => {
        if (prefValue == 'dislike'){
            console.log("dislike pushed")
        } else if (prefValue == 'neutral') {
            console.log("neutral pushed")
        } else if (prefValue == 'prefer') {
            console.log("prefer pushed")
        }
    }
    
    return (
        //button group that puts all buttons in one component, just to make code less redundant
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => handlePrefButton('dislike')}>Dislike All</Button>
            <Button onClick={() => handlePrefButton('prefer')}>Prefer All</Button>
        </ButtonGroup>
    );
};

const MemberPreferences = () => {
    //array that holds the categories of particular house
    const [houseCategories, setHouseCategories] = useState<String[]>()
    const [preferID, setPreferID] = useState<String>();
    let house = 'EUC';
    
    //gets all categories from the backend
    //Euclid is hardcoded in so info appears.
    useEffect(() => {
        // getCategories(house).then((value) => {
            
        //     setHouseCategories(value);
        //     console.log("value returned from getCategories", houseCategories);
        // });
        setHouseCategories(["Misc", "Cooking", "Cleaning"])
    }, []);

    

    //change when shift queries allow to get by categories
    const dummyArr = [{"name":"cook breakie"}, {"name":"cook din din"}, {"name":"prepare lunch"}]
    return (
        <div className={styles.memberPrefPage}>
            {/* title of page */}
            <div className={styles.title}>
                <Typography className={styles.prevPage} variant='h2'>Settings/</Typography> 
                <Typography className={styles.taskTitle} variant='h2'>Task Preferences</Typography>    
            </div>
            <div className={styles.prefTables}>
                {/* maps through house categories and creates a table for each table */}
                {houseCategories?.map((item,index) => {
                    return (
                        <div key={index} className={styles.spefTable} >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{item}  {dummyArr.length} shifts</TableCell>
                                            <TableCell align="right">
                                                <PreferCategoryButton />
                                            </TableCell>
                                        </TableRow>
                                        
                                    </TableHead>
                                    
                                    {/* goes through each task and creates a row with a button that determines user's preference */}
                                    {/* should be changed when able to grab tasks for each category */}
                                    <TableBody>
                                        {dummyArr.map((shift, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{shift}</TableCell>
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
    );
};

export default MemberPreferences;