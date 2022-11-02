import { Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getHouse } from "../../../firebase/queries/house";
import { getUser } from "../../../firebase/queries/user";
import { House, User } from "../../../types/schema";
import styles from "./AvailabilityInfo.module.css";

type AvailabilityInfoProps = {
  userID: string;
};

const AvailabilityInfo: React.FC<AvailabilityInfoProps> = ({
  userID,
}: AvailabilityInfoProps) => {
  const [user, setUser] = useState<User | null>();
  let daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const getData = async () => {
      const currUser = await getUser(userID);
      setUser(currUser);
    };
    getData();
  }, [userID]);

  const getTime = (day: string) => {
    let availabilities = user?.availabilities.get(day);
    let parsedAvailabilities = "";

    if (availabilities) {
      console.log(availabilities);
      for (let i = 0; i < availabilities.length; i += 2) {
        console.log(availabilities[i]);
        parsedAvailabilities +=
          parseHour(availabilities[i]) +
          ":" +
          parseMinute(availabilities[i]) +
          parseAM(availabilities[i]) +
          " - " +
          parseHour(availabilities[i + 1]) +
          ":" +
          parseMinute(availabilities[i + 1]) +
          parseAM(availabilities[i + 1]);
        if (i + 2 < availabilities.length) {
          parsedAvailabilities += ", ";
        }
      }
      return parsedAvailabilities;
    } else {
      return "N/A";
    }
  };

  const parseHour = (timeWindow: number) => {
    if (timeWindow == 1200 || timeWindow == 0) {
      return 12;
    } else if (timeWindow >= 1000) {
      return Math.floor(timeWindow / 100) % 12;
    } else return Math.floor(timeWindow / 10) % 12;
  };

  const parseMinute = (timeWindow: number) => {
    if (timeWindow % 100 == 0) {
      return "00";
    }
    return timeWindow % 100;
  };

  const parseAM = (timeWindow: number) => {
    return timeWindow >= 1200 ? "PM" : "AM";
  };

  return user ? (
    <Card sx={{ minWidth: 500 }}>
      <CardContent className={styles.card}>
        <div className={styles.flex}>
          <Typography variant="h4">Availability</Typography>
          {/* <Typography variant="caption" className={styles.updated}>
            Last updated 3 minutes ago
          </Typography> */}
        </div>
        <hr className={styles.line} />
        <div className={styles.body}>
          {daysList.map((day) => (
            <Typography key={day} className={styles.bodyText} variant="body1">
              {day}
              {": "}
              {getTime(day)}
            </Typography>
          ))}
        </div>
      </CardContent>
    </Card>
  ) : (
    <div></div>
  );
};

export default AvailabilityInfo;
