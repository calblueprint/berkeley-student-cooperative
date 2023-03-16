export type User = {
  // this id is to help the standard table generalize the id attribute
  id?: string
  // ID of the user (not stored in Firebase, attached to user)
  userID: string
  // Role of the user
  role: string
  // Last Name
  lastName: string
  // First Name
  firstName: string
  // User email
  email: string
  // The houseID of the house that the user resides in
  houseID: string
  // Hours the user has been assigned
  hoursAssigned: number
  // Hours the user must be assigned, always set to 5
  // TODO: this should be taken off since it's always set to 5
  hoursRequired?: number
  // Shifts that the user has been assigned
  // TODO: this should be taken off since we will be listing the actual scheduled shifts instead of the general shifts
  shiftsAssigned?: string[]
  // Hours that they have to verify for the rest of the week
  // TODO: this should be removed since we are changing the way we track hours
  hoursRemainingWeek?: number
  // Hours that they have to verify for the rest of the semester
  // TODO: this should be removed since we are changing the way we track hours
  hoursRemainingSemester?: number
  // Pin Number for verifying other people's tasks
  pinNumber: number
  // Total fines assessed to this user
  // TODO: this should be removed since we are not tracking fines, we are tracking penatly hours
  totalFines?: number
  // Map of availabilities (day: time windows when they're free)
  availabilities: { day: number[] }[]
  // Map of preferences (taskID: (0/1/2 (higher number = greater preference)))
  preferences: { taskID: number }[]

  //** new attributes below */
  preference?: string
  hoursUnassigned?: number
  // full name that gets displayed
  displayName?: string
  // The scheduled shifts that the user has been assigned
  assignedScheduledShifts?: string[]
  // Missed workshift hours this user has missed this current week
  weekMissedHours?: number
  // Hours that manager has added to this user as a penatly for missing a shift this current week
  weekPenaltyHours?: number
  // The running total of missed workshift hours for the whole semester
  runningTotalMissedHours?: number
  // The running total of penalty hours for the whole semester
  runningTotalPenatlyHours?: number
}

export type Shift = {
  // optional id attribute for table stuff
  id?: string
  // Name of the shift
  name: string
  // ID of the shift (not stored in Firebase, attached to shift)
  shiftID: string
  // Description of the shift
  description: string
  // Possible days that the shift can be done on
  possibleDays: string[]
  // Number of people who can be assigned to this shift
  // TODO: remove this because all shifts will have only one user
  numOfPeople?: number
  // Time window that this shift must be done in [startTime, endTime]
  timeWindow: number[]
  // property to display timeWindow
  timeWindowDisplay: string
  // Day that the shift is assigned
  assignedDay: string
  // Hours earned for a user
  hours: number
  // Number of hours since end time that you are allowed to verify a shift for
  verificationBuffer: number
  verification: boolean
  // Users assigned to the shift
  // TODO: remove this because all shifts will have only one user
  usersAssigned?: string[]
  // Category of work that the shift belongs to
  category: string

  //** new attributes below */

  // User assigned to the shift
  assignedUser?: string
}

// TODO: remove this because we are no longer using this
export type VerifiedShift = {
  autoID: string
  timeStamp: string
  shifterID: string
  verifierID: string
}

// TODO: add date, verifiedAt, and unverifiedBy attributes
export type ScheduledShift = {
  id: string
  shiftID: string
  // date: dateObj? string?
  assignedUser: string
  status: string
  options: string
  verifiedBy: string
  // verifiedAt: dateObj? timestampObj? string?
  // unverifiedAt: dateObj? timestampObj? string?
  penaltyHours: number
}

export type House = {
  id: string
  houseID: string
  categories: { string: string[] }
  // TODO: remove members because we can simply use the firebase's .where() to filter through the users for a certain house
  members?: string[] | null
  address: string
  schedule: { string: string[] }
  userPINs: { string: string }
}

export enum Day {
  Mon = 'Monday',
  Tue = 'Tuesday',
  Wed = 'Wednesday',
  Thu = 'Thursday',
  Fri = 'Friday',
  Sat = 'Saturday',
  Sun = 'Sunday',
}
export type RowOfCSV = {
  // TODO: add application number so that we can use this as the unique id for the authorizedUsers
  email: string
  firstName: string
  lastName: string
  houseID: string
  accountCreated: boolean
}
