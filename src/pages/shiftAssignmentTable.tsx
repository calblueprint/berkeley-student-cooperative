
import { User } from "../types/schema";


type ShiftAssignmentTableProps = {
    users: User[],
    shiftID: string
}
const ShiftAssignmentTable: React.FC<ShiftAssignmentTableProps> = ({users, shiftID} : ShiftAssignmentTableProps) => {
    type RowData = {
        name: string,
        hoursRemaining: number,
        preference: string
    }
    
    const createRow = (user: User) : RowData => {
        let name = user.name;
        let hoursRemaining = user.hoursRemainingWeek;
        // convert number preference to string preference
        let numberToText = new Map<number, string>();
        numberToText.set(0, "dislikes");
        numberToText.set(1, "");
        numberToText.set(2, "prefers");
        let stringPreference = "";
        if (user.preferences.has(shiftID)) {
            let numericalPreference = user.preferences.get(shiftID);
            if (numericalPreference !== undefined && numberToText.has(numericalPreference)) {
                let newPref = numberToText.get(numericalPreference);
                if (newPref !== undefined) {
                    stringPreference = newPref;
                }
            }
        }
        let preference = stringPreference;
        let newRow = {
            name,
            hoursRemaining,
            preference
        };
        return newRow;
    }
    
    const initializeRows = () => {
        let ret = [];
        for (let i = 0; i < users.length; i++) {
            ret.push(createRow(users[i]));
        }
        return ret;
    }

    const rows = initializeRows();

    return (
        <div>
            {rows.map((rowData, index) => (
                <div key = {index}> 
                    <div> {rowData.name}</div>
                    <div> {rowData.hoursRemaining}</div>
                    <div> {rowData.preference}</div>
                </div>
                
            ))}
        </div>
    )
}

export default ShiftAssignmentTable;