import * as React from 'react';
import {useState, useEffect} from 'react';
import { getCategories, updateCategory } from '../../../firebase/queries/house';
import {Box,Typography, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, ButtonGroup} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import styles from './memberPreferences.module.css'
import { updateUser } from '../../../firebase/queries/user';
import { mapToObject } from '../../../firebase/helpers';
import { getShift } from '../../../firebase/queries/shift';
import Layout from '../../../components/Layout/Layout';
// import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useFirebaseAuth } from "../../../firebase/queries/auth";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// declare module '@material-ui/core/styles/createTheme' {
//     interface ThemeOptions {    
//         themeName?: string  // optional
//     }
// }



type preferBtnProps = {
    shiftID: string;
};

type preferCategoryProps = {
    shifts: any;
}
const theme = createTheme({
    palette: {
      primary: {
        main: '#898989',
      },
      secondary: {
        main: '#FFFFFF',
      },
    },
  });

const PreferButton: React.FC<preferBtnProps> = ({shiftID}: preferBtnProps) => {
    const { authUser } = useFirebaseAuth();
    
    const [preferColor, setPreferColor] = useState("primary")
    const [dislikeColor, setDislikeColor] = useState("primary")
    const [prefBgColor, setPrefBgColor] = useState("#EFEFEF")
    const [dislikeBgColor, setDislikeBgColor] = useState("#EFEFEF")

    /**
   * Updates a user's preferences in the firebase.
   * @remark This method should be called whenever a button on the preference page is pressed.
   * @remark Logic pertaining to authContext hasn't been added yet, currently working on it
   * @remark Also please ignore styling, I am working on the logic at the moment.
   * 
   * @public
   * 
   */
    //  const handleSubmit = async () => {
    //     let newMap = mergeMap(assignedMap);
    //     let newData = {
    //         availabilities: mapToObject(newMap)
    //     }
    //     await updateUser(userID, newData);
    // }
    const prefMap = authUser.preferences;
    const handlePrefButton =  async (prefValue :string) => {
        
        if (prefValue == 'dislike' && dislikeColor != "secondary"){
            console.log("dislike this shift", shiftID)
            prefMap.set(shiftID, prefValue);
            setDislikeColor("secondary")
            setDislikeBgColor("#000000")
        }  else if (prefValue == 'dislike' && dislikeColor == "secondary"){
            setDislikeColor("primary")
            setDislikeBgColor("#EFEFEF")
            prefMap.set(shiftID, "");

        } else if (prefValue == 'prefer' && preferColor != "secondary") {
            console.log("prefer pushed", shiftID)
            prefMap.set(shiftID, prefValue);
            setPreferColor("secondary")
            setPrefBgColor("#000000")
        }  else if (prefValue == 'prefer' && preferColor == "secondary"){
            setPreferColor("primary")
            setPrefBgColor("#EFEFEF")
            prefMap.set(shiftID, "");

        }
        
        console.log("PREF MAP", prefMap);
        const newData = {
            preferences: mapToObject(prefMap)
        }
        await updateUser(authUser.userID, newData);
    }
    // const updatePreference = async () => {
    //     let newData = {
    //         preferences: prefValue
    //     }
    //     await updateUser(authUser.userID, newData);
    // }

    // useEffect(() => {
    //     let newData = {
    //         preferences: mapToObject(newMap)
    //     }
    //     await updateUser(authUser.userID, newData);
    // },[])
    
    
    return (
        //button group that puts all buttons in one component, just to make code less redundant
        <ThemeProvider theme={theme}>

            <Button variant="outlined" color={dislikeColor} sx={ { margin: 1, borderRadius: 20, backgroundColor: dislikeBgColor } } onClick={() => handlePrefButton('dislike')}>Dislike</Button>
            <Button variant="outlined" color={preferColor} sx={ { margin: 1, borderRadius: 20, backgroundColor: prefBgColor } } onClick={() => handlePrefButton('prefer')}>Prefer</Button>
        </ThemeProvider>
    );
};

const PreferCategoryButton: React.FC<preferCategoryProps> = ({shifts}: preferCategoryProps) => {
    const { authUser } = useFirebaseAuth();
    const [preferColor, setPreferColor] = useState("primary")
    const [dislikeColor, setDislikeColor] = useState("primary")
    const [prefBgColor, setPrefBgColor] = useState("#EFEFEF")
    const [dislikeBgColor, setDislikeBgColor] = useState("#EFEFEF")

    /**
   * Updates a user's preference for a singular category in the firebase.
   * @remark This method should be called whenever a button on the preference page is pressed.
   * @remark Logic pertaining to authContext hasn't been added yet, currently working on it
   * @remark Also please ignore styling, I am working on the logic at the moment.
   * 
   * @public
   * 
   */

    const handlePrefButton = (prefValue : string) => {
        if (prefValue == 'dislike' && dislikeColor != "secondary"){
            console.log("dislike this shift")
            setDislikeColor("secondary")
            setDislikeBgColor("#000000")
            setPrefBgColor("#EFEFEF")
            setPreferColor("primary")
        } else if (prefValue == 'dislike' && dislikeColor == "secondary"){
            setDislikeColor("primary")
            setDislikeBgColor("#EFEFEF")

        } else if (prefValue == 'prefer' && preferColor != "secondary") {
            console.log("prefer pushed")
            setPreferColor("secondary")
            setPrefBgColor("#000000")
            setDislikeBgColor("#EFEFEF")
            setDislikeColor("primary")
        } else if (prefValue == 'prefer' && preferColor == "secondary"){
            setPreferColor("primary")
            setPrefBgColor("#EFEFEF")
            setDislikeColor("primary")
          
            

        }
    }

    return (
        //button group that puts all buttons in one component, just to make code less redundant
        <ThemeProvider theme={theme}  >
            <Button className={styles.preferCate} variant="outlined" color={dislikeColor} sx={ { margin: 1, borderRadius: 20, backgroundColor: dislikeBgColor } } onClick={() => handlePrefButton('dislike')}>Dislike</Button>
            <Button variant="outlined" color={preferColor} sx={ { margin: 1, borderRadius: 20, backgroundColor: prefBgColor } } onClick={() => handlePrefButton('prefer')}>Prefer</Button>
        </ThemeProvider>
    );
};



const MemberPreferences = () => {
    //array that holds the categories of particular house
    const [houseCategories, setHouseCategories] = useState<Map<string, (Map<string, string[]>)> | undefined>(undefined)
    const [preferID, setPreferID] = useState<string>();
    const { authUser } = useFirebaseAuth();
    const [tabHolder, setTabHolder] = useState('1')

    
    //gets all categories from the backend
    //Euclid is hardcoded in so info appears, but will depend on user.
    useEffect(() => {
        
     
         getCategories('EUC').then((category) => {
            
            const mapHolder = new Map<string, (Map<string, string[]>)>();
            
            // let preferences = authUser.preferences;
            const preferenceMap = new Map<string, string>();
            preferenceMap.set('DrqlMb9jA7Uq5wW7nNNK', 'prefer');
            category.forEach((value, key) => {
                const inMapHold = value
                
                const categoriesMap = new Map<string, string[]>();
                inMapHold.forEach((val, k) => { 
                    if(val && k){
                       
                        categoriesMap.set("prefer goes here", [val, k]);
                    }
                    
                });
                
                 mapHolder.set(key,categoriesMap )
            })
            


            //holds categories in houseCategories useState
            // for(let i = 0; i < categoriesMap.length; i++) {
            //     let shiftArr = Object.entries(categoriesMap[i][1]);
            //     let taskMap = new Map<string[], string>();
            //     for(let j = 0; j < shiftArr.length; j++){
            //         preferenceMap.forEach((value, key) => {
            //             // console.log("value of preferMap")
            //             // console.log("key for pref map", key);
            //             // console.log("shiftArr shiftID", shiftArr[j][0])
            //             // console.log("TorF", key == shiftArr[j][0]);
            //             if(key == shiftArr[j][0]){
            //                 taskMap.set(shiftArr[j], value);
            //                 // console.log("taskMap worked", taskMap)
            //             } else{
            //                 taskMap.set(shiftArr[j], "");
            //             }
            //         })
                
            //     }
                
            //     mapHolder.set(categoriesMap[i][0], taskMap);
            // }
            // console.log(mapHolder)
            
          setHouseCategories(mapHolder)
        //   console.log("arr of housecates", Object.entries(Object.fromEntries(mapHolder)));
           
        });
       
        

        
    }, []);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabHolder(newValue);
      };

    return houseCategories ? (
        <Layout>
        
            {/* title of page */}
            <div className={styles.title}>
                <Typography className={styles.prevPage} style={ {fontSize: '40pt'}}>Settings</Typography> 

                <TabContext value={tabHolder}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={handleChange}  aria-label="lab API tabs example">
                        <Tab sx={{color: "#000000"}} label="Information" value="1" />
                        <Tab sx={{color: "#000000"}} label="Availibility" value="2" />
                        <Tab sx={{color: "#000000"}} label="Preferences" value="3" />
                        </TabList>
                    </Box>
                </TabContext>
            </div>
            <div className={styles.prefTables}>

                {/* iterates through house categories and creates a table for each category */}
                {Object.entries(Object.fromEntries(houseCategories))?.map((category, key) => {
                    
                    return (
                        <div key={key} className={styles.spefTable} >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontSize: '32pt'}} className='category'>{category[0]}</TableCell>
                                            <TableCell align="right">
                                                <PreferCategoryButton shifts={Object.entries(Object.fromEntries(category[1]))} />
                                            </TableCell>
                                        </TableRow>
                                        
                                    </TableHead>
                                    
                                    {/* for each category it iterates through each shift to display */}
                                    <TableBody>
                                        {Object.entries(Object.fromEntries(category[1]))?.map((value, index) => {
                                           
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{value[1][0]}</TableCell>
                                                    <TableCell align="right">
                                                        <PreferButton shiftID={value[1][1]}/>
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
        
            </Layout>
        ) : 
        (<div></div>);
};

export default MemberPreferences;

// {Object.entries(Object.fromEntries(houseCategories))?.map((category, key) => {
//     return (
//         <div key={key} className={styles.spefTable} >
//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell style={{backgroundColor:'lightblue', fontSize: '19pt'}} className='category'>{category[0]}</TableCell>
//                             <TableCell style={{backgroundColor:'lightblue'}}align="right">
//                                 {/* <PreferButton /> */}
//                             </TableCell>
//                         </TableRow>
                        
//                     </TableHead>
                    
//                     {/* for each category it iterates through each shift to display */}
//                     <TableBody>
//                         {Object.entries(Object.fromEntries(category[1]))?.map((value, index) => {
//                             return (
//                                 <TableRow key={index}>
//                                     <TableCell>{value[1]}</TableCell>
//                                     <TableCell align="right">
//                                         {/* <PreferButton /> */}
//                                     </TableCell>
//                                 </TableRow>
//                             )
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     )
// })}

// {houseCategories?.forEach((value, key) => {
//     return (key&&value) ?  (
//         <div key={"idk"} className={styles.spefTable} >
//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell style={{backgroundColor:'lightblue', fontSize: '19pt'}} className='category'>value</TableCell>
//                             <TableCell style={{backgroundColor:'lightblue'}}align="right">
//                                 <PreferCategoryButton shifts="right"/>
//                             </TableCell>
//                         </TableRow>
                        
//                     </TableHead>
                    
//                     {/* for each category it iterates through each shift to display */}
//                     <TableBody>
//                         {value?.forEach((value, key) => {
//                             return (
//                                 <TableRow key={index}>
//                                     <TableCell>"value"</TableCell>
//                                     <TableCell align="right">
//                                         <PreferButton shiftID="hey"/>
//                                     </TableCell>
//                                 </TableRow>
//                             )
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     ) : 
//     (<div></div>)
// })}