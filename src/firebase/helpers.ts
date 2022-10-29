import { User } from "../types/schema";

export const mapToObject = (map: Map<any, any>): Object => {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        v instanceof Map ? [k, mapToObject(v)] : [k, v]
      )
    );
};

export const objectToMap = (obj: Object): Map<any, any> => {
    return new Map(
        Array.from(Object.entries(obj), ([k, v]) =>
        v instanceof Map ? [k, objectToMap(v)] : [k, v]
        )
    );
};
  
export const mapToJSON = (map: Map<any, any>): string => {
    return JSON.stringify(mapToObject(map));
}

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
}

export const convertTimeWindowToTime = (start: number, end: number): string => {
  let startPeriod = convertNumberToTime(start);
  let endPeriod = convertNumberToTime(end);
  return startPeriod + " - " + endPeriod;
}

export const pluralizeHours = (hours: number): string => {
  if (hours == 1) {
    return hours + " hour";
  }
  return hours + " hours";
}

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
}