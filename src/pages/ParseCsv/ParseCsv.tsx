import * as react from "react";
// import Papa from 'papaparse';
import Papa from "papaparse";
// import { readFileSync } from 'fs';
import { useState, useEffect } from "react";
import { Input, SelectChangeEvent, TextField } from "@mui/material";
import {addRowOfCSV} from "../../firebase/queries/csvManagement";

const ParseCSV = () => {
  type InternalRowOfCSV = {
    email: string;
    firstName: string;
    lastName: string;
    houseID: string;
  }
  
  const [fileHolder, setFileHolder] = useState("");
  const [userArr, setUserArr] = useState<Object[]>([]);

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
          uploadRowsToFirebase(userHolder);
        },
      });
    }
  }, [fileHolder]);

  const uploadRowsToFirebase = async (rowList: Object[]) => {
    for (let i = 0; i < rowList.length; i++) {
      let row = rowList[i];
      addRowOfCSV(row.email, row.firstName, row.lastName, row.houseID);
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
      <input type="file" onChange={(e) => uploadCSV(e.target.files[0])} />

      {userArr.length > 0 && userArr[0].lastName
        ? userArr.map((item, index) => {
            return (
              <div key={index}>
                <h2>
                  {item.firstName} {item.lastName}'s email is {item.email} and
                  they live in {item.house}.
                </h2>
              </div>
            );
          })
        : userArr.length > 0 && userArr[0].lastName == undefined
        ? "please input csv file with fields lastName, firstName, email, house."
        : "No members found"}
    </div>
  );
};

export default ParseCSV;
