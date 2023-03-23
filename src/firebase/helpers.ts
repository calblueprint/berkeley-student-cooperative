import { Dictionary, EntityId } from '@reduxjs/toolkit'
import { Shift, User } from '../types/schema'

// Used to convert a map to an object uploadable to Firebase
// export const mapToObject = (map: Map<any, any>): Object => {
//   return Object.fromEntries(Array.from(map.entries(), ([k, v]) => [k, v]))
// }

// Used to convert an object from Firebase back into a map (doesn't work for nested maps)
// export const objectToMap = (obj: Object): Map<any, any> => {
//   return new Map(Array.from(Object.entries(obj), ([k, v]) => [k, v]))
// }

// export const mapToJSON = (map: Map<any, any>): string => {
//   return JSON.stringify(mapToObject(map))
// }

// Generates a pin number for a user
export const generatePinNumber = (numDigitsInPin: number) => {
  return Math.floor(
    Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) +
      10 ** (numDigitsInPin - 1)
  )
}

// Converts an individual time into a valid time
export const convertNumberToTime = (input: number): string => {
  let timePeriod = ' AM'
  if (input >= 1200) {
    timePeriod = ' PM'
  }
  if (input > 1259) {
    input %= 1200
  }
  if (input < 100) {
    input = 1200 + input
  }
  const hour = Math.floor(input / 100) + ''
  let minute = (input % 100) + ''
  if (input % 100 < 10) {
    minute = minute + '0'
  }
  return hour + ':' + minute + timePeriod
}

// Converts a time window into a numeric time window
export const convertTimeWindowToTime = (start: number, end: number): string => {
  const startPeriod = convertNumberToTime(start)
  const endPeriod = convertNumberToTime(end)
  return startPeriod + ' - ' + endPeriod
}

// Pluralizes hour into hours if needed
export const pluralizeHours = (hours: number): string => {
  if (hours == 1) {
    return hours + ' hour'
  }
  return hours + ' hours'
}

/**
 * Converts a user's numeric preference for a shift (0,1,2) to a string value
 * (dislikes, neutral, prefers).
 * @param user - The userObject
 * @param shiftID - The ID of a shift
 *
 * @returns string value representing a user's preference for a shift
 */
export const numericToStringPreference = (
  user: User,
  shiftID: string
): string => {
  const numberToText = new Map<number, string>()
  numberToText.set(0, 'dislikes')
  numberToText.set(1, '')
  numberToText.set(2, 'prefers')
  if (shiftID in user.preferences) {
    const p: User['preferences'] = user.preferences
    const numericalPreference: number = p[shiftID]
    if (
      numericalPreference !== undefined &&
      numberToText.has(numericalPreference)
    ) {
      const newPref = numberToText.get(numericalPreference)
      if (newPref !== undefined) {
        return newPref
      }
    }
  }
  return ''
}

const generateAllPossibleTimeWindows = () => {
  const ret = []
  let i = 0
  ret.push(i)
  i += 30
  while (i < 2400) {
    ret.push(i)
    ret.push(i)
    if (i % 100 == 30) {
      i += 70
    } else {
      i += 30
    }
  }
  ret.splice(ret.length - 1, 1)
  return ret
}

// List of all possible time windows, uses private helper generateAllPossibleTimeWindows
export const allPossibleTimeWindows: number[] = generateAllPossibleTimeWindows()

// List of all possible days
export const days: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/**
 * Helper function called on submit from AvailabilityInputModal used to merge time intervals together before uplaoding to Firebase.
 * @param map - The map of availabilities of a user
 * @returns The map of availabilities of a user but the user's time windows have been merged together to be non-contiguous and non-overlapping. Repeated process for every day.
 */
export const mergeMap = (map: Map<string, number[]>) => {
  const tempMap = new Map<string, number[]>()
  map.forEach((value, key) => {
    let newList: number[] = []
    const intervals = []
    // Creates intervals
    for (let i = 0; i < value.length; i += 2) {
      intervals.push([value[i], value[i + 1]])
    }
    if (intervals.length < 2) {
      newList = [...value]
    } else {
      // Merge intervals algorithm
      intervals.sort((a, b) => a[0] - b[0])
      let prev = intervals[0]
      for (let i = 1; i < intervals.length; i++) {
        if (prev[1] >= intervals[i][0]) {
          prev = [prev[0], Math.max(prev[1], intervals[i][1])]
        } else {
          newList.push(prev[0])
          newList.push(prev[1])
          prev = intervals[i]
        }
      }
      newList.push(prev[0])
      newList.push(prev[1])
    }
    tempMap.set(key, newList)
  })
  return tempMap
}

export const parseTime = (time: number) => {
  let meridian = 'AM'
  if (time == 0) {
    return '12AM'
  }
  if (time > 1159) {
    meridian = 'PM'
  }
  if (time > 1259) {
    time = time - 1200
  }
  const timeString = String(time)
  let hours
  if (timeString.length > 3) {
    hours = timeString.slice(0, 2)
  } else {
    hours = timeString.slice(0, 1)
  }
  const minutes = timeString.slice(-2)
  if (Number(minutes) > 0) {
    return hours + ':' + minutes + meridian
  }
  return hours + meridian
}

export const firestoreAutoId = (): string => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i += 1) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return autoId
}

// Helper RegEx used for email validation
export const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

export const sortPotentialUsers = (
  dict: Dictionary<User>,
  totalUsersInHouse: EntityId[],
  shiftID: string
) => {
  const sorted = totalUsersInHouse.sort((uid1, uid2) => {
    const user1 = dict[uid1]
    const user2 = dict[uid2]
    if (user1 === undefined || user2 === undefined) {
      return 0
    }
    // First sort on hours assignable left (hoursRequired - hoursAssigned), prioritizing people with higher hours remaining (user2 - user1)
    const user1HoursLeft = 5 - user1.hoursAssigned
    const user2HoursLeft = 5 - user2.hoursAssigned
    const hoursWeekDiff: number = user2HoursLeft - user1HoursLeft
    if (hoursWeekDiff != 0) {
      console.log(hoursWeekDiff)
      return hoursWeekDiff
    }

    const user1Preferences: User['preferences'] = user1.preferences
    const user2Preferences: User['preferences'] = user2.preferences
    // 1 if 1 is average
    let user1Pref = 1
    let user2Pref = 1
    if (shiftID in user1Preferences) {
      const curr = user1Preferences[shiftID]
      if (curr !== undefined) {
        user1Pref = curr
      }
    }
    if (shiftID in user2Preferences) {
      const curr = user2Preferences[shiftID]
      if (curr !== undefined) {
        user2Pref = curr
      }
    }
    // Second sort on preferences, prioritizing people with higher preferences (user2 - user1)
    return user2Pref - user1Pref
  })
  return sorted
}

export const findAvailableUsers = (
  tempShiftObject: Shift,
  dict: Dictionary<User>,
  totalUsersInHouse: EntityId[],
  shiftID: string,
  day: string
) => {
  const timeWindow = tempShiftObject.timeWindow
  const shiftStart = timeWindow[0]
  const shiftEnd = timeWindow[1]
  const numHours = tempShiftObject.hours
  const potentialUsers = []
  const ids = []
  // Convert the hours of the shift into units of time. Assumes any non-whole hour numbers are 30 minute intervals.
  // ex. 1.5 -> converted to 130 (used for differences if someone is available between 1030 and 1200, they should be shown)
  const mult100 = Math.floor(numHours) * 100
  let thirtyMin = 0
  if (mult100 != numHours * 100) {
    thirtyMin = 30
  }
  for (let i = 0; i < totalUsersInHouse.length; i++) {
    const userObject = dict[totalUsersInHouse[i]]
    if (userObject === undefined) {
      continue
    }
    // if this user has already been assigned to this shift, display them regardless of hours
    // console.log(shiftID in userObject.assignedScheduledShifts);
    if (
      userObject.assignedScheduledShifts !== undefined &&
      userObject.assignedScheduledShifts.includes(shiftID)
    ) {
      ids.push(totalUsersInHouse[i])
      potentialUsers.push(userObject)
      continue
    }
    // stores the number of hours that the user still has to complete
    const assignableHours = 5 - userObject.hoursAssigned
    // if they have no hours left to complete, or their number of hours left to complete < the number of hours of the shift, continue
    if (assignableHours <= 0 || assignableHours < numHours) {
      continue
    }
    const currAvailabilities: User['availabilities'] = userObject.availabilities
    if (currAvailabilities && day in currAvailabilities) {
      const perDayAvailability = currAvailabilities[day]
      if (perDayAvailability === undefined) {
        continue
      }
      // iterate thru every pair of availabilities
      for (let j = 0; j < perDayAvailability.length; j += 2) {
        let currStart = perDayAvailability[j]
        const permEnd = perDayAvailability[j + 1]
        // The end of this availability window is < the time it takes for the shift to start
        if (permEnd < shiftStart) {
          continue
        }
        // start either at the beginning of the shift window / beginning of their availability, whichever is later
        currStart = Math.max(currStart, shiftStart)
        // The end time given the current start
        // 1030 + 100 + 30 -> 1160 (still <= 1200) (still works)
        const newEnd = currStart + mult100 + thirtyMin
        // The required end will either be the end of the shift or the end of their availabikity
        const requiredEnd = Math.min(permEnd, shiftEnd)
        // If the calculated end time is <= required end time, then we can push and don't need to consider any more availabilities
        if (newEnd <= requiredEnd) {
          ids.push(totalUsersInHouse[i])
          potentialUsers.push(userObject)
          break
        }
      }
    }
  }
  return ids
}
