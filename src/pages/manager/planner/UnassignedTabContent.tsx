import { useEffect, useState } from 'react'
import UnassignedShiftList from '../../../components/ManagerComponents/UnassignedShiftsList/UnassignedShiftsList'
import SortedTable from '../../../components/shared/tables/SortedTable'
import { useUserContext } from '../../../context/UserContext'
import { getAllShifts } from '../../../firebase/queries/shift'
import { Shift } from '../../../interfaces/interfaces'

export const UnassignedTabContent = () => {
  const [authUser, house] = useUserContext()

  const [shifts, setShifts] = useState<Shift[] | undefined>([])

  useEffect(() => {
    async function fetchShifts() {
      const response = await getAllShifts(house)
      if (!response) {
        setShifts([])
      } else {
        setShifts(response)
      }
    }
    fetchShifts()
  }, [house])

  return (
    <>
      <UnassignedShiftList />
      <SortedTable data={shifts} headCells={} isCheckable={false} />
    </>
  )
}
