import internal from "stream";

export type User = {
  userID: string;
  role: string;
  lastName: string;
  firstName: string;
  email: string;
  houseID: string;
  // update
  hoursAssigned: number;
  hoursRequired: number;
  shiftsAssigned: string[];
  hoursRemainingWeek: number;
  hoursRemainingSemester: number;
  pinNumber: number;
  totalFines: number;
  availabilities: Map<string, number[]>;
  preferences: Map<string, number>;
};

export type Shift = {
  name: string;
  shiftID: string;
  description: string;
  possibleDays: string[];
  numOfPeople: number;
  // time 
  timeWindow: number[];
  assignedDay: string;
  hours: number;
  // number of hours since end time that you are allowed to verify
  verification: boolean;
  verificationBuffer: number;
  usersAssigned: string[];
  category: string;
};

export type House = {
  houseID: string;
  members: string[] | null;
  address: string;
  categories: Map<string, Map<string, string>>;
  schedule: Map<string, string[]>;
  userPINs: Map<string, string>;
};

export enum Day {
  Mon = 'Monday',
  Tue = 'Tuesday',
  Wed = 'Wednesday',
  Thu = 'Thursday',
  Fri = 'Friday',
  Sat = 'Saturday',
  Sun = 'Sunday'
};
export type RowOfCSV = {
  email: string;
  firstName: string;
  lastName: string;
  houseID: string;
  accountCreated: boolean;
}
