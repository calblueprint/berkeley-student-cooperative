import { EntityId, Dictionary } from '@reduxjs/toolkit'

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export type Order = 'asc' | 'desc'

//** It needs to be any because this function will be used for shifts, users, etc. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | string[] | number[] },
  b: { [key in Key]: number | string | string[] | number[] }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(
  array: EntityId[],
  entities: Dictionary<T>,
  comparator: (a: T, b: T) => number
) {
  // const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  const stabilizedThis = array.map(
    (id: EntityId, index) => [entities[id], index, id] as [T, number, EntityId]
  )
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((id) => id[2])
}

export function formatMilitaryTime(militaryTime: number): string {
  // if (!militaryTime) return '00:00'
  const hour = Math.floor(militaryTime / 100)
  const minute = militaryTime % 100
  const isPM = hour >= 12

  // Convert hour to 12-hour format
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12

  // Add leading zero to minute if needed
  const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`

  // Add AM/PM indicator
  const ampm = isPM ? 'PM' : 'AM'

  // Return formatted time string
  return `${formattedHour}:${formattedMinute}${ampm}`
}
