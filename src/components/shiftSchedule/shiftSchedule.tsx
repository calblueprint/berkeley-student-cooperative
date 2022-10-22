/*
    1. House everything in a shiftSchedule component
    2. Have overview table that has shiftname, status, time, etc
        1. To get num shifts, just take len # of shifts.  For members needed to verify.  Take a sum of num ppl needed to do every shift, take a sum of verified shifts.  subtract num ppl - num shifts
    3. Have dropdown to select M-F.
    4. useEffect to retrieve house field from user, pass it to getHouse.  save House
    5. use House to get array of shifts.
    6.  Make a shift() component, will pass shift name(shiftID), status(len of verified Shifts array), and time into this for now.  (will need other fields l8r).
    7. for loop:  Loop thru all shifts, pass verified shift to new shift components.     Order doesn’t matter for now (might be easy to implement tho)
    8. For Frontend:  Only show the shifts based on what day we are in, in the view
    9.
*/
import React from "react";
import { useAuth } from "../../firebase/queries/auth";





export const shiftSchedule = () => {

    const { authUser, register, signIn, signOutAuth } = useAuth();
    return (
        
    )

}


