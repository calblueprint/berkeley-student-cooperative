import internal from "stream";

export type User = {
  userID: string;
  role: string;
  name: string;
  email: string;
  houseID: string;
  totalHoursAssigned: number;
  shiftsAssigned: string[];
  hoursRemainingWeek: number;
  hoursRemainingSemester: number;
  pinNumber: number;
  totalFines: number;
  availabilities: Map<string, number[]>;
  preferences: Map<string, number[]>;
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
}

export type House = {
  houseID: string;
	categories: string[]
  members: string[] | null;
  address: string;
  schedule: Map<string, string[]>;
  userPINs: Map<string, string>;
};
