import React, {useState, useEffect} from "react";
import { User } from "../../types/schema";
import { Typography, Card } from '@mui/material';
import styles from "./MemberShiftView.module.css"

type MemberShiftViewProps = {
	member: string;
}

export const MemberShiftView: React.FunctionComponent<MemberShiftViewProps> = ({member}) => {

	const toVerifyCards = () => (
		<div className={styles["cards"]}>
			<div className={styles["leftCard"]}>left</div>
			<div className={styles["rightCard"]}>right</div>
		</div>
	);

	return (
		<div>
			<Typography variant="h2"> My Schedule </Typography>
			{toVerifyCards()}
		</div>
	)
}