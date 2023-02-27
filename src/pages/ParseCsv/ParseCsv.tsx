//import * as react from 'react'
// import Papa from 'papaparse';
import Papa from 'papaparse'
// import { readFileSync } from 'fs';
import { useState, useEffect, useCallback } from 'react'
//import { Input, SelectChangeEvent, TextField } from '@mui/material'
import { addRowOfCSV } from '../../firebase/queries/authorizedUsers'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
// TODO: ADD way to view uploaded CSV (named with houseID)
const ParseCSV = () => {
  //useState that holds file user uploads
  const [fileHolder, setFileHolder] = useState<File>()

  //useState that holds user objects after papaparse finishes running
  //const [userArr, setUserArr] = useState<Object[]>([])
  // Stores the file that the CSV is stored; used to upload the CSV directly to Firebase
  const [file, setFile] = useState<File>()
  // Storage used to upload CSV
  const storage = getStorage()

  // Function that uploads a list of pre-approved emails to Firebase; also uploads the CSV to Firebase storage
  const uploadRowsToFirebase = useCallback(async (
    rowList: memberRow[],
    //fileHolder: string
  ) => {
    let house = ''
    for (let i = 0; i < rowList.length; i++) {
      const row = rowList[i]
      if (
        row.house === undefined ||
        row.lastName === undefined ||
        row.firstName === undefined ||
        row.email === undefined
      ) {
        console.log('Invalid data')
        return
      }
      if (house === '') {
        house = row.house
      } else if (row.house !== house) {
        console.log('Contains data from multiple houses')
      }
    }
    for (let i = 0; i < rowList.length; i++) {
      const row = rowList[i]
      addRowOfCSV(row.email, row.firstName, row.lastName, row.house)
    }
    if (file !== null && file !== undefined) {
      const storageRef = ref(storage, house)
      uploadBytes(storageRef, file)
      alert('Successful Upload')
    }
  }, [file, storage])

  //runs everyitme fileHolder updates
  useEffect(() => {
    //checks if fileHolder has a file in it
    if (fileHolder) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const userHolder: any[] = []

      //papaparse parses the csv file passed in and updates the userArr when finished
      Papa.parse(fileHolder, {
        header: true,
        skipEmptyLines: true,
        download: true,
        step: function (row) {
          userHolder.push(row.data)
        },
        complete: function () {
          //setUserArr(userHolder)
          uploadRowsToFirebase(userHolder)
  
        },
      })
      
    }
  }, [fileHolder, uploadRowsToFirebase])

  

  /**
   * Updates fileHolder and userArr useStates.
   *
   * @param file - File that is uploaded by user

   * 
   * @remark I know this entire file has a lot of errors :sobbing-emoji: it works though, VSCode just does not like me. I'll revist the errors later please.
   * 
   * 
   * 
   * @public
   * 
   */
  const uploadCSV = (file: File) => {
    //checks if the file uploaded is a csv file
    if (file?.type == 'text/csv') {
      setFileHolder(file)
      //setUserArr([])
    } else {
      window.alert("Ew! This isn't a csv file. YUCk!!")
    }
  }

  const handleUploadClick = (lst: FileList | null) => {
    if (lst === null) {
      console.log('Invalid input')
      return
    }
    uploadCSV(lst[0])
    const item = lst.item(0)
    if (item !== null) {
      setFile(item)
    }
  }

  return (
    <div>
      <h2>Upload File Here:</h2>
      {/* <label htmlFor="upload-csv">
                    <Input
                        id="upload-csv"

                        name="upload-csv"
                        type="file"
                        
                        value={fileHolder}
                        onChange={(event) => {uploadCSV(event.target.value)}}
                    />
                    <Input type="submit" value="Submit" id="submitButton" />
              
            </label> */}
      <input type="file" onChange={(e) => handleUploadClick(e.target.files)} />
    </div>
  )
}
type memberRow = {
  house: string
  firstName: string
  lastName: string
  email: string
}

export default ParseCSV
