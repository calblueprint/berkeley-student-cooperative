import * as react from "react";
// import Papa from 'papaparse';
import Papa from "papaparse";
// import { readFileSync } from 'fs';
import { useState, useEffect } from "react";
import { Input, SelectChangeEvent, TextField } from "@mui/material";
import {addRowOfCSV} from "../../firebase/queries/authorizedUsers";
import {getStorage, ref, uploadBytes} from "firebase/storage";


const ParseCSV = () => {
  
  const [fileHolder, setFileHolder] = useState("");
  const [userArr, setUserArr] = useState<Object[]>([]);
  const [file, setFile] = useState<File>();
  const storage = getStorage();

  useEffect(() => {
    if (fileHolder != "") {
      let userHolder: String[] = [];
      const papaholder = Papa.parse(fileHolder, {
        header: true,
        skipEmptyLines: true,
        download: true,
        step: function (row) {
          userHolder.push(row.data);
        },
        complete: function () {
          setUserArr(userHolder);
          uploadRowsToFirebase(userHolder, fileHolder);
        },
      });
    }
  }, [fileHolder]);

  const uploadRowsToFirebase = async (rowList: Object[], fileHolder: string) => {
    let house = "";
    for (let i = 0; i < rowList.length; i++) {
      let row = rowList[i];
      if (row.house === undefined || row.lastName === undefined || row.firstName === undefined || row.email === undefined) {
        console.log("Invalid data");
        return;
      }
      if (house === "") {
        house = row.house;
      } else if (row.house !== house) {
        console.log("Contains data from multiple houses");
      }      
    }
    for (let i = 0; i < rowList.length; i++) {
      let row = rowList[i];
      addRowOfCSV(row.email, row.firstName, row.lastName, row.house);
    }
    if (file !== null && file !== undefined) {
      const storageRef = ref(storage, house);
      uploadBytes(storageRef, file);
      alert("Successful Upload");
    }
  }

  const uploadCSV = (file: any) => {
    if (file?.type == "text/csv") {
      setFileHolder(file);
      setUserArr([]);
    } else {
      window.alert("Ew! This isn't a csv file. YUCk!!");
    }
  };

  const handleUploadClick = (lst: FileList | null) => {
    if (lst === null) {
      console.log("Invalid input");
      return;
    }
    uploadCSV(lst[0]);
    let item = lst.item(0);
    if (item !== null) {
      setFile(item);
    }
  }

  return (
    <div>
      <h3>In parse csv</h3>

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
  );
};

export default ParseCSV;
