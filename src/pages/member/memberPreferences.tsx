import * as React from 'react';
import {useState, useEffect} from 'react';
import {Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import styles from './memberPreferences.module.css'

const MemberPreferences = () => {

    const dummyArr = {cooking : ["cook breakie", "cook din din", "prepare lunch"]}
    return (
        <div className={styles.memberPrefPage}>
            <div className={styles.title}>
                <Typography className={styles.prevPage} variant='h2'>Settings/</Typography> 
                <Typography className={styles.taskTitle} variant='h2'>Task Preferences</Typography>    
            </div>
            <div className={styles.prefTables}>
                <Table>

                </Table>

            </div>
        
        </div>
    );
};

export default MemberPreferences;