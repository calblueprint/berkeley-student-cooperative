import React, { useState } from 'react'
import { User, Shift } from '../../../types/schema'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import {
  sortPotentialUsers,
  findAvailableUsers,
} from '../../../firebase/helpers'
import SortedTable from '../../shared/tables/SortedTable'
import { numericToStringPreference } from '../../../firebase/helpers'
import { EntityId, Dictionary } from '@reduxjs/toolkit'
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../../store/apiSlices/userApiSlice'
import {
  selectShiftById,
  useUpdateShiftMutation,
} from '../../../store/apiSlices/shiftApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { HeadCell } from '../../../interfaces/interfaces'
import Grid from '@mui/material/Unstable_Grid2'

// waiting on sorted table to only allow selecting 1 checkbox at a time
// pass in something that's been selected
// somehow need to refetch on update

type AvailableUsersTableProps = {
  day: string
  houseID: string
  shiftID: string
  unselect: boolean
  handleAssignedUserId: (userId: string) => void
  handleClose: () => void
  handleEditShift?: (shiftId: string) => void
}

const displayNameFn = (user: User) => {
  if (!user) {
    return ''
  }
  if (user.displayName) {
    return user.displayName
  }
  return user.firstName + ' ' + user.lastName
}

const hoursAssignedFn = (user: User, shiftID: string | number) => {
  if (!user) {
    return ''
  }
  return numericToStringPreference(user, shiftID as string)
}
const preferenceFn = (user: User, hoursRequired: string | number) => {
  const h = (hoursRequired as number) - user.hoursAssigned
  return h.toString()
}

const headCells: HeadCell<User>[] = [
  {
    id: 'displayName',
    isNumeric: false,
    label: 'Available Users',
    isSortable: false,
    align: 'left',
    transformFn: displayNameFn,
  },
  {
    id: 'hoursUnassigned',
    isNumeric: true,
    label: 'Unassigned Hours',
    isSortable: true,
    align: 'left',
    complexTransformFn: hoursAssignedFn,
  },
  {
    id: 'preference',
    isNumeric: false,
    label: 'Preference',
    isSortable: true,
    align: 'left',
    complexTransformFn: preferenceFn,
  },
]

// state doesn't work, no selected / update shift /user
const AvailableUsersTable: React.FC<AvailableUsersTableProps> = ({
  day,
  houseID,
  shiftID,
  handleAssignedUserId,
  handleEditShift,
  handleClose,
  unselect,
}: AvailableUsersTableProps) => {
  /**
   * A modal that appears when a manager wants to assign people/unassign people from a shift.
   * Matches people to shifts based on availabilities.
   * @remarks
   * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
   * Contains a ShiftAssignmentTable.
   *
   * @param day - The day that is selected when the manager is going through shifts on a day-by-day view
   * @param houseID - The ID of the house that the manager manages
   * @param shiftID - The ID of the shift that the manager has selected.
   * @returns AvailableUsersTable
   */

  // Store usersObject (access a user object from usersObject.entities[userID])
  const {
    data: usersObject,
    // isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    // isError: isUsersError,
  } = useGetUsersQuery({ houseID })

  const [
    updateShift,
    {
      // isLoading: isLoadingUpdateShift,
      isSuccess: isSuccessUpdateShift,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateShiftMutation()

  const [
    updateUser,
    {
      // isLoading: isLoadingUpdateShift,
      isSuccess: isSuccessUpdateUser,
      // isError: isErrorUpdateShift,
      // error: errorUpdateShift,
    },
  ] = useUpdateUserMutation()

  // Stores the shiftObject of the give shift
  const shiftObject = useSelector(
    (state: RootState) =>
      selectShiftById(houseID)(state, shiftID as EntityId) as Shift
  )

  // Stores the entity id's of users who could potentially work this shift (will include )
  const [potentialWorkersID, setPotentialWorkersID] = useState<
    EntityId[] | undefined
  >([])
  // Stores the displayEntities (with the added fields of preference, displayName, and hoursUnassigned)
  const [displayEntities, setDisplayEntities] = useState<Dictionary<User>>()
  // Stores the user that will be assigned to the shift if Save button is clicked (if it's "", no one is assigned)
  const [assignedUserID, setAssignedUserID] = useState<string>(
    shiftObject?.assignedUser ?? ''
  )

  const [disableTable, setDisableTable] = useState<boolean>(false)

  const hoursRequired = 5

  useEffect(() => {
    if (isSuccessUpdateShift && isSuccessUpdateUser) {
      handleClose()
    }
  }, [isSuccessUpdateShift, isSuccessUpdateUser, handleClose])

  // On page load, retrieves the shift and sets the shift Object and also populates the potentialWorkers + selectedRows arrays
  useEffect(() => {
    if (isUsersSuccess) {
      const userIDs = filterIDsByHouseAndAvailability()
      sortAndAddFieldsToUsers(userIDs)
    }
  }, [isUsersSuccess])

  useEffect(() => {
    handleAssignedUserId(assignedUserID)
  }, [assignedUserID, handleAssignedUserId])
  useEffect(() => {
    if (unselect) {
      handleDeselectUser()
    }
  }, [unselect])

  useEffect(() => {
    // console.log('AssigneUserId: ', assignedUserID)
    if (!assignedUserID || assignedUserID === '') {
      // console.log('Enable table: ')
      setDisableTable(false)
    } else {
      // console.log('Disable talbe ')
      setDisableTable(true)
    }
  }, [assignedUserID])

  // Returns the user IDs of users in the house that are available, sets the assignedUserID based on if the shiftObject has an assigned user
  const filterIDsByHouseAndAvailability = () => {
    const workersInHouse = usersObject?.ids.filter(
      (id: EntityId) => usersObject?.entities[id]?.houseID == houseID
    )
    if (
      shiftObject.assignedUser !== undefined &&
      shiftObject.assignedUser !== ''
    ) {
      setAssignedUserID(shiftObject.assignedUser)
    }
    if (usersObject !== undefined && workersInHouse !== undefined) {
      return findAvailableUsers(
        shiftObject,
        usersObject.entities,
        workersInHouse,
        shiftID,
        day
      )
    }
    return []
  }

  // Sorts the potential workers and sets the state
  // Makes a deepcopy of the entities to add optional fields for display (sets displayEntities)
  const sortAndAddFieldsToUsers = (userIDs: EntityId[]) => {
    if (userIDs === undefined || usersObject === undefined) {
      return
    }
    const copy = sortPotentialUsers(usersObject.entities, userIDs, shiftID)
    setPotentialWorkersID(copy)
    // makes a deepcopy of entities so we can modify them
    const newDictionary: { [id: string]: User | undefined } = JSON.parse(
      JSON.stringify(usersObject.entities)
    )
    for (const key in newDictionary) {
      newDictionary[key] = newDictionary[key] as User
    }
    for (let i = 0; i < copy.length; i++) {
      const id = copy[i]
      const worker: User | undefined = newDictionary[id]
      if (worker === undefined) {
        continue
      }
      worker.displayName = worker.firstName + ' ' + worker.lastName
      worker.preference = numericToStringPreference(worker, shiftID)
      if (!worker.hoursAssigned) {
        worker.hoursUnassigned = hoursRequired
      } else if (worker.hoursAssigned < 0) {
        worker.hoursAssigned = 0
      }
      // console.log(worker.hoursAssigned)
      worker.hoursUnassigned = hoursRequired - worker.hoursAssigned
      // console.log(worker.hoursAssigned)
    }
    setDisplayEntities(newDictionary)
  }

  // Called to update the shift and user objects in the backend
  // Updates the user originally assigned to the shift (if there exists one)
  // Updates the shift object
  // Updates the user newly assigned to the shift (if there exists one)
  const updateUserAndShiftObjects = async () => {
    let originallyAssignedUserID = shiftObject.assignedUser
    if (originallyAssignedUserID === undefined) {
      originallyAssignedUserID = ''
    }
    if (
      originallyAssignedUserID === assignedUserID ||
      usersObject === undefined
    ) {
      console.log('no change')
      return
    }
    if (originallyAssignedUserID !== '') {
      // UPDATE OLD USER
      // clear the shift id from the user's list of shifts (assignedScheduleShifts) + decrease their assigned hours
      const originalUser = usersObject.entities[originallyAssignedUserID]
      if (originalUser !== undefined) {
        // Update shift list
        let originalAssignedShifts = originalUser.assignedScheduledShifts
        if (originalAssignedShifts === undefined) {
          originalAssignedShifts = []
        }
        const originalUserShiftsCopy = [...originalAssignedShifts]
        const index = originalUserShiftsCopy.indexOf(shiftID, 0)
        if (index > -1) {
          originalUserShiftsCopy.splice(index, 1)
        }
        // Update hours
        const originalUserAssignedHours = originalUser.hoursAssigned
        const originalUserNewHours =
          originalUserAssignedHours - shiftObject.hours
        const dataToUpdateOldUser = {
          data: {},
          houseId: houseID,
          userId: originallyAssignedUserID,
        }
        dataToUpdateOldUser.data = {
          hoursAssigned: originalUserNewHours,
          assignedScheduledShifts: originalUserShiftsCopy,
        }
        await updateUser(dataToUpdateOldUser)
      }
    }

    // UPDATE SHIFT
    // update assigned Day and assignedUser
    // decrease the number of hours of this shift to their hoursAssigned
    const dataToUpdateShift = { data: {}, houseId: houseID, shiftId: shiftID }
    if (assignedUserID === '') {
      dataToUpdateShift.data = {
        assignedDay: '',
        assignedUser: '',
      }
    } else {
      dataToUpdateShift.data = {
        assignedDay: day,
        assignedUser: assignedUserID,
      }
    }
    await updateShift(dataToUpdateShift)

    // UPDATE NEW USER
    // increase their hours and push it onto the list
    if (assignedUserID === '') {
      console.log('No new user assigned')
      return
    }
    const newUser = usersObject.entities[assignedUserID]
    if (newUser === undefined) {
      console.log('undefined id for new user')
      return
    }
    // Update list
    let newUserAssignedShifts = newUser.assignedScheduledShifts
    if (newUserAssignedShifts === undefined) {
      newUserAssignedShifts = []
    }
    const newUserShiftsCopy = [...newUserAssignedShifts]
    const index = newUserShiftsCopy.indexOf(shiftID, 0)
    if (index == -1) {
      newUserShiftsCopy.push(shiftID)
    }

    // Update hours
    const newAssignedHours = newUser.hoursAssigned + shiftObject.hours
    const dataToUpdateNewUser = {
      data: {},
      houseId: houseID,
      userId: assignedUserID,
    }
    dataToUpdateNewUser.data = {
      hoursAssigned: newAssignedHours,
      assignedScheduledShifts: newUserShiftsCopy,
    }
    await updateUser(dataToUpdateNewUser)
  }

  // Sets the state variable of the currently assigned variable
  // If the last row clicked is the same as the assignedUserID, it untoggled them from being assigned
  const updateAssignedUser = (event: React.MouseEvent<unknown>, id: string) => {
    if (!assignedUserID) {
      console.log('Selecting User')
      setAssignedUserID(id)
    }
  }

  const handleDeselectUser = () => {
    setAssignedUserID('')
  }

  return (
    <React.Fragment>
      <SortedTable
        ids={potentialWorkersID as EntityId[]}
        entities={
          displayEntities as Dictionary<
            User & { [key in keyof User]: string | number }
          >
        }
        headCells={headCells}
        isCheckable={false}
        isSortable={false}
        disable={disableTable}
        handleRowClick={updateAssignedUser}
      />
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid smOffset={9}>
          {!assignedUserID && !shiftObject.assignedUser ? (
            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                handleEditShift ? handleEditShift(shiftID) : null
              }
            >
              Edit Shift
            </Button>
          ) : null}
        </Grid>
        {/* <Grid xs /> */}
        <Grid smOffset={'auto'} mdOffset={'auto'} lgOffset={'auto'}>
          <Button
            variant="contained"
            fullWidth
            onClick={updateUserAndShiftObjects}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default AvailableUsersTable
