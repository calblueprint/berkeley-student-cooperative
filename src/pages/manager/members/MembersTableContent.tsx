import { useEffect, useState } from "react"
import SortedTable from "../../../components/shared/tables/SortedTable"
import { useUserContext } from "../../../context/UserContext"
import { getAllUsers } from "../../../firebase/queries/user"
import { HeadCell, User } from "../../../interfaces/interfaces"

const headCells: HeadCell<User>[] = [
    {
      id: 'firstName',
      isNumeric: false,
      label: 'Member Name',
      isSortable: true,
    },
    {
      id: 'totalFines',
      isNumeric: true,
      label: 'Fine',
      isSortable: false,
    },
    {
      id: 'email',
      isNumeric: false,
      label: 'Email',
      isSortable: false,
    },
  ]

  export const MembersTableContent = () => {
    const { house } = useUserContext()
  
    const [members, setMembers] = useState<User[] | undefined>([])
    // const [displayMembers, setDisplayMembers] = useState<User[] | undefined>(
    //   members
    // )
  
  
    // runs when the component mounts and when the house changes
    // ALL the shifts (unfiltered)
    useEffect(() => {
      async function fetchShifts() {
        const response = await getAllUsers(house.houseID)
        if (!response) {
          setMembers([])
        } else {
          // format data here before setting the data (in this case, shifts)
          setMembers(
            response
            //   .filter((member) => {
            //     return member.usersAssigned?.length == 0
            //   })
            //   .map((shift) => {
            //     const time1 = formatMilitaryTime(shift.timeWindow[0])
            //     const time2 = formatMilitaryTime(shift.timeWindow[1])
            //     shift.timeWindowDisplay = time1 + ' - ' + time2
            //     shift.id = shift.shiftID
            //     return shift
            //   })
          )
        }
      }
      fetchShifts()
    }, [house])
  
    // runs when the component mounts and when filterBy or shifts changes
    // the filtered shifts (filtered by day)
    // useEffect(() => {
    //   setDisplayShifts(
    //     filterBy === filters[0]
    //       ? shifts
    //       : shifts?.filter((shift) =>
    //           shift.possibleDays
    //             .map((day) => day.toLocaleLowerCase())
    //             .includes(filterBy)
    //         )
    //   )
    // }, [filterBy, shifts])
  
    return (
      <>
        {/* <UnassignedShiftList /> */}
        {/* <Select value={filterBy} onChange={handleFilterChange}>
          {filters.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select> */}
        <SortedTable
          data={members}
          headCells={headCells}
          isCheckable={false}
        />
      </>
    )
  }