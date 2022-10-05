export type User = {
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

export type House = {
    members: string[] | null;
    address: string;
    schedule: Map<string, string[]>;
};

export type Task = {

};

export type Shift = {
    possibleDays: string[];
    timeWindow: number[];
    hours: number;
    numOfPpl: number;
    assignedDay: string | null;
    verification: Map<string, string> | null;
    description: string;
};