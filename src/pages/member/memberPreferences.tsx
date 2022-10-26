import * as React from 'react';
import {useState, useEffect} from 'react';
import { getCategories } from '../../firebase/queries/house';
import {Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, ButtonGroup} from '@mui/material';
import styles from './memberPreferences.module.css'

const PreferButton = () => {
    return (
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button>Dislike</Button>
            <Button>Neutral</Button>
            <Button>Prefer</Button>
        </ButtonGroup>
    );
};

const MemberPreferences = () => {
    const [houseCategories, setHouseCategories] = useState<String[]>()
    useEffect(() => {
        getCategories('EUC').then((value) => {
            
            setHouseCategories(value);
            console.log("value returned from getCategories", houseCategories);
        });
    }, []);

    const dummyArr = ["cook breakie", "cook din din", "prepare lunch"]
    return (
        <div className={styles.memberPrefPage}>
            <div className={styles.title}>
                <Typography className={styles.prevPage} variant='h2'>Settings/</Typography> 
                <Typography className={styles.taskTitle} variant='h2'>Task Preferences</Typography>    
            </div>
            <div className={styles.prefTables}>
                {houseCategories?.map((item,index) => {
                    return (
                        <div key={index} className={styles.spefTable} >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{item}</TableCell>
                                            <TableCell align="right">
                                                <PreferButton/>
                                            </TableCell>
                                        </TableRow>
                                        
                                    </TableHead>
                                    <TableBody>
                                        {dummyArr.map((shift, idx) => {
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{shift}</TableCell>
                                                    <TableCell align="right">
                                                        <PreferButton/>
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
                
                <TableContainer>
                            <Table>

                            </Table>
                        </TableContainer>
            </div>
        
        </div>
    );
};

export default MemberPreferences;