import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

/*
    1. Take in the stats of a shift, represents it as a row in overall table, ShiftSchedule.
 */

interface shiftRowProps {
  shiftName: string,
  timeWindow: number[],
  numOfPpl: number,
  numVerified: number
}
export const ShiftRow = ({shiftName, timeWindow, numOfPpl, numVerified}: shiftRowProps) => {
  var status = "Missing";
  if (numOfPpl > numVerified){
    status = "Incomplete";
  } else {
    status = "Complete";
  }

  //May be helpful in helper file.
  const parseTime = (time: number) => {
    let meridian = "AM";
    if (time > 1230) {
      time = time - 1200;
      meridian = "PM";
    } 
    let timeString = String(time);
    if (timeString.slice(-2) == "30") {
      return timeString.slice(0, 2) + ":" + timeString.slice(-2) + meridian; 
    }
    return timeString.slice(0, 2) + meridian; 
  }

  const startTime = parseTime(timeWindow[0]);
  const endTime = parseTime(timeWindow[1]);
  console.log("Vars", {shiftName: shiftName, time: startTime + " - " + endTime, status: status});
  return (
    <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="right">{shiftName}</TableCell>
      <TableCell align="right">{startTime + " - " + endTime}</TableCell>
      <TableCell align="right">{status}</TableCell>
    </TableRow>
  )
}
export default ShiftRow;