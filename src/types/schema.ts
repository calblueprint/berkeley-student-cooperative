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
  preferences: string[];
};

export type Shift = {
  shiftID: string;
  description: string;
  possibleDays: string[];
  // time window unsure if 48 or 24 / set or what
  timeWindow: number[];
  // assigned Days??
  assignedDay: string;
  hours: number;
  // not sure about this representation
  verificationWindow: number[];
  usersAssigned: string[];
};