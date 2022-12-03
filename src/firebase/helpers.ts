import { User } from "../types/schema";

export const mapToObject = (map: Map<any, any>): Object => {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        [k, v]
      )
    );
};

export const objectToMap = (obj: Object): Map<any, any> => {
    return new Map(
        Array.from(Object.entries(obj), ([k, v]) =>
        [k, v]
        )
    );
};
  
export const mapToJSON = (map: Map<any, any>): string => {
    return JSON.stringify(mapToObject(map));
}

export const firestoreAutoId = (): string => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let autoId = "";

  for (let i = 0; i < 20; i += 1) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
};

export const convertNumberToTime = (input: number): string => {
  let timePeriod = " AM";
  if (input >= 1200) {
    timePeriod = " PM";
  }
  if (input > 1259) {
    input %= 1200;
  }
  if (input < 100) {
    input = 1200 + input;
  }
  let hour = Math.floor(input / 100) + "";
  let minute = input % 100 + "";
  if (input % 100 < 10) {
    minute = minute + "0";
  }
  return hour + ":" + minute + timePeriod;
};

export const convertTimeWindowToTime = (start: number, end: number): string => {
  let startPeriod = convertNumberToTime(start);
  let endPeriod = convertNumberToTime(end);
  return startPeriod + " - " + endPeriod;
};

export const pluralizeHours = (hours: number): string => {
  if (hours == 1) {
    return hours + " hour";
  }
  return hours + " hours";
};

export const numericToStringPreference = (user: User, shiftID: string): string => {
  let numberToText = new Map<number, string>();
  numberToText.set(0, "dislikes");
  numberToText.set(1, "");
  numberToText.set(2, "prefers");
  if (user.preferences.has(shiftID)) {
      let numericalPreference = user.preferences.get(shiftID);
      if (numericalPreference !== undefined && numberToText.has(numericalPreference)) {
          let newPref = numberToText.get(numericalPreference);
          if (newPref !== undefined) {
              return newPref;
          }
      }
  }
  return ""
};

const generateAllPossibleTimeWindows = () => {
  let ret = [];
  let i = 0; 
  ret.push(i);
  i += 30;
  while (i < 2400) {
    ret.push(i);
    ret.push(i);
    if (i % 100 == 30) {
      i += 70;
    } else {
      i += 30;
    }
  }
  ret.splice(ret.length - 1, 1);
  return ret;
}

export const allPossibleTimeWindows: number[] = generateAllPossibleTimeWindows();

export const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const mergeMap = (map: Map<string, number[]>) => {
  let tempMap = new Map<string, number[]>();
  map.forEach((value, key) => {
    let newList: number[] = [];
    let intervals = [];
    for (let i = 0; i < value.length; i += 2) {
      intervals.push([value[i], value[i + 1]]);
    }
    if (intervals.length < 2) {
      newList = [...value];
    } else {
      intervals.sort((a, b) => a[0] - b[0]);
      let prev = intervals[0];
      for (let i = 1; i < intervals.length; i++) {
        if (prev[1] >= intervals[i][0]) {
          prev = [prev[0], Math.max(prev[1], intervals[i][1])];
        } else {
          newList.push(prev[0]);
          newList.push(prev[1]);
          prev = intervals[i];
        }
      }
      newList.push(prev[0]);
      newList.push(prev[1]);
    }
    tempMap.set(key, newList);
  })
  return tempMap;
}

export const parseTime = (time: number) => {
  let meridian = "AM";
  if (time == 0) {
    return "12AM";
  }
  if (time > 1159) {
    meridian = "PM";
  }
  if (time > 1259) {
    time = time - 1200;
  } 
  let timeString = String(time);
  let hours;
  if (timeString.length > 3) {
    hours = timeString.slice(0, 2);
  } else {
    hours = timeString.slice(0, 1);
  }
  let minutes = timeString.slice(-2);
  if (Number(minutes) > 0) {
    return hours + ":" + minutes + meridian; 
  }
  return hours + meridian; 
}

export const firestoreAutoId = (): string => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i += 1) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
};

export const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
