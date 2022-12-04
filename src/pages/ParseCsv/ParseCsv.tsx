import * as react from "react";
// import Papa from 'papaparse';
import Papa from "papaparse";
// import { readFileSync } from 'fs';
import { useState, useEffect } from "react";
import { Input, SelectChangeEvent, TextField } from "@mui/material";

const ParseCSV = () => {

  //useState that holds file user uploads
  const [fileHolder, setFileHolder] = useState("");

  //useState that holds user objects after papaparse finishes running
  const [userArr, setUserArr] = useState<Object[]>([]);

  //runs everyitme fileHolder updates
  useEffect(() => {
    //checks if fileHolder has a file in it
    if (fileHolder != "") {
      let userHolder: any[] = [];

      //papaparse parses the csv file passed in and updates the userArr when finished
      const papaholder = Papa.parse(fileHolder, {
        header: true,
        skipEmptyLines: true,
        download: true,
        step: function (row) {
          userHolder.push(row.data);
        },
        complete: function () {
          setUserArr(userHolder);
        },
      });
    }
  }, [fileHolder]);

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
  const uploadCSV = (file: any) => {
    //checks if the file uploaded is a csv file
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
          
       {/* lets user know if the csv file they uploaded fits the correct standards */}
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
