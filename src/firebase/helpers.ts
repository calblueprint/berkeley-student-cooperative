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