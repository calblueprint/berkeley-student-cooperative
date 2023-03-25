import { TextField } from '@mui/material'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import EditUserCard from '../../../components/shared/userCard/EditUserCard'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { HeadCell } from '../../../interfaces/interfaces'
import { useGetUsersQuery } from '../../../store/apiSlices/userApiSlice'
import { User } from '../../../types/schema'

const headCells: HeadCell<User & { [key in keyof User]: string | number }>[] = [
  {
    id: 'displayName',
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
  const { data, isLoading, isSuccess, isError } = useGetUsersQuery({})

  //** Modal stuff */
  const [open, setOpen] = useState(false)
  //** State variables that pass the selected item's info from the table to the modal */
  const [modalMemberID, setModalMemberID] = useState<string>()
  //** end Modal stuff */

  const [members, setMembers] = useState<EntityId[] | undefined>([])
  const [filterBy, setFilterBy] = useState<string>('')
  const [displayMembers, setDisplayMembers] = useState<EntityId[] | undefined>(
    members
  )

  const isIn = (memberID: EntityId) => {
    return data?.entities[memberID]?.displayName
      ?.toLowerCase()
      .includes(filterBy.toLowerCase())
  }

  const isMember = (memberID: EntityId) => {
    return data?.entities[memberID]?.role == 'Member'
  }

  const resetDisplayMembers = () => {
    if (members) {
      setDisplayMembers(members.filter(isMember))
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    memberID: EntityId
  ) => {
    const member = data?.entities[memberID]
    setModalMemberID(member?.id)
    handleOpen()
  }

  useEffect(() => {
    if (isSuccess && data) {
      setMembers(data.ids)
      setDisplayMembers(members)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (members) {
      resetDisplayMembers()
    }
  }, [members])

  useEffect(() => {
    if (filterBy.length > 0) {
      setDisplayMembers(members?.filter(isIn))
    } else {
      resetDisplayMembers()
    }
  }, [filterBy])
  if (isLoading) {
    return <div>Loading...</div>
  } else if (isError) {
    return <div>Error</div>
  } else {
    return (
      <>
        <TextField
          value={filterBy}
          placeholder="Search"
          onChange={(event) => {
            setFilterBy(event.target.value)
          }}
        ></TextField>
        <SortedTable
          ids={displayMembers as EntityId[]}
          entities={
            data?.entities as Dictionary<
              User & { [key in keyof User]: string | number }
            >
          }
          headCells={headCells}
          isCheckable={false}
          isSortable={false}
          handleRowClick={handleRowClick}
        />
        <EditUserCard userId={modalMemberID} open={open} setOpen={setOpen} editType='Information'/>
      </>
    )
  }
}
