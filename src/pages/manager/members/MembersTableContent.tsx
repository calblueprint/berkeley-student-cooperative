import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
import { HeadCell } from '../../../interfaces/interfaces'
import { useGetUsersQuery } from '../../../store/apiSlices/userApiSlice'
import { User } from '../../../types/schema'

const headCells: HeadCell<User & { [key in keyof User]: string | number }>[] = [
  {
    id: 'firstName',
    isNumeric: false,
    label: 'Member Name',
    isSortable: true,
    align: 'left',
  },
  {
    id: 'totalFines',
    isNumeric: true,
    label: 'Fine',
    isSortable: false,
    align: 'left',
  },
  {
    id: 'email',
    isNumeric: false,
    label: 'Email',
    isSortable: false,
    align: 'left',
  },
]

export const MembersTableContent = () => {
  const { house } = useUserContext()
  const { data, isLoading, isSuccess, isError } = useGetUsersQuery(
    house?.houseID
  )
  console.log(house, data, isLoading, isSuccess, isError)

  // TODO: connect marcos' modal
  // //** Modal stuff */
  // const [open, setOpen] = useState(false)
  // //** State variables that pass the selected item's info from the table to the modal */
  // const [modalShift, setModalShift] = useState<Shift>()
  // const [modalUser, setModalUser] = useState<User>()
  // //** end Modal stuff */

  // TODO: filter by search
  // //** Table stuff */
  // const [displayShifts, setDisplayShifts] = useState<EntityId[] | undefined>(
  //   shifts
  // )
  // const [filterBy, setFilterBy] = useState<string>(filters[0])
  // //** end Table stuff */

  const [members, setMembers] = useState<EntityId[] | undefined>([])

  // runs when the component mounts and when the house changes
  // ALL the shifts (unfiltered)
  // useEffect(() => {
  //   async function fetchUsers() {
  //     const response = await getAllUsers(house)
  //     if (!response) {
  //       setMembers([])
  //     } else {
  //       setMembers(response)
  //     }
  //   }
  //   fetchUsers()
  // }, [house])

  useEffect(() => {
    if (isSuccess && data) {
      setMembers(data.ids)
    }
  }, [isSuccess, data])

  if (isLoading) {
    return <div>Loading...</div>
  } else if (isError) {
    return <div>Error</div>
  } else {
    return (
      <>
        {/* <Select value={filterBy} onChange={handleFilterChange}>
          {filters.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select> */}
        <SortedTable
          ids={members as EntityId[]}
          entities={
            data?.entities as Dictionary<
              User & { [key in keyof User]: string | number }
            >
          }
          headCells={headCells}
          isCheckable={false}
          isSortable={false}
        />
      </>
    )
  }
}
