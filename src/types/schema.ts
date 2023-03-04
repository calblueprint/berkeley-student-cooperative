// import internal from 'stream'

export type User = {
  id?: string
  // ID of the user (not stored in Firebase, attached to user)
  userID: string
  // Role of the user
  role: string
  // LastName
  lastName: string
  // FirstName
  firstName: string
  // User email
  email: string
  // The houseID of the house that the user resides in
  houseID: string
  // Hours the user has been assigned
  hoursAssigned: number
  // Hours the user must be assigned
  hoursRequired: number
  // Shifts that the user has been assigned
  shiftsAssigned: string[]
  // Hours that they have to verify for the rest of the week
  hoursRemainingWeek: number
  // Hours that they have to verify for the rest of the semester
  hoursRemainingSemester: number
  // Pin Number for verifying other people's tasks
  pinNumber: number
  // Total fines assessed to this user
  totalFines: number
  // Map of availabilities (day: time windows when they're free)
  availabilities: Map<string, number[]>
  // Map of preferences (taskID: (0/1/2 (higher number = greater preference)))
  preferences: Map<string, number>
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
  numOfPeople: number
  // Time window that this shift must be done in [startTime, endTime]
  timeWindow: { startTime: number; endTime: number }
  // property to display timeWindow
  timeWindowDisplay: string
  // Day that the shift is assigned
  assignedDay: string
  // Hours earned for a user
  hours: number
  verification: boolean
  // Number of hours since end time that you are allowed to verify a shift for
  verificationBuffer: number
  // Users assigned to the shift
  usersAssigned: string[]
  // Category of work that the shift belongs to
  category: string
}

export type VerifiedShift = {
  autoID: string
  timeStamp: string
  shifterID: string
  verifierID: string
}

export type House = {
  houseID: string
  categories: Map<string, Map<string, string>>
  members: string[] | null
  address: string
  schedule: Map<string, string[]>
  userPINs: Map<string, string>
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
  email: string
  firstName: string
  lastName: string
  houseID: string
  accountCreated: boolean
}
