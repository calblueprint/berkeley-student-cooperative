export interface User {
  // this id attribute is for the table stuff
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

export interface Shift {
  // this id attribute is for the table stuff
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
  timeWindow: number[]
  // Display for timeWindow
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

// passing in any data type
export interface HeadCell<
  T extends {
    [key in keyof T]:
      | string
      | number
      | string[]
      | number[]
      | { day: number[] }[]
      | { taskID: number }[]
  }
> {
  id: keyof T
  label: string
  isNumeric: boolean
  isSortable: boolean
  isButton?: boolean
  button?: React.FC
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
  transformFn?: (value: T) => string
  complexTransformFn?: (a: T, b: string | number) => string
}
