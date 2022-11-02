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

export const convertNumberIntoMonetaryValue = (fine: number): string => {
  return "$" + fine.toFixed(2);
}