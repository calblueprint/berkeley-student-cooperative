import React, {useState, useEffect} from "react";
import { User } from "../../../../types/schema";
import { Typography, Card, TextField, Button } from '@mui/material';
import styles from "./MemberScheduleHeader.module.css";
import Icon from "../../../../assets/Icon";
import { MemberShiftFilters } from "../MemberShiftFilters/MemberShiftFilters";


type MemberScheduleHeaderProps = {
	member?: string;
}

export const MemberScheduleHeader: React.FunctionComponent<MemberScheduleHeaderProps> = ({member}) => {

	return (
		<div className={styles.background}>
			<div className={styles.container}>
				<div className={styles.title}>
					<Typography variant="h2"> Schedule </Typography>
				</div>
				<div className={styles.bottom}>
					<div className={styles.pages}>
						<button className={styles.pageButton}>
							<Typography variant="h6" style = {{fontWeight: 700}}> Individual </Typography>
						</button>
						<button className={styles.pageButton}>
							<Typography variant="h6" style = {{color: "#969696"}}> All shifts </Typography>
						</button>
					</div>
					<div className={styles.dates}>
						<button className={styles.dateButton}>
								<Icon type="leftArrow" className={styles.scale}/>
								<Typography variant="subtitle1" className={styles.text}>
									Dec 20 - Dec 27
								</Typography>
								<Icon type="rightArrow" className={styles.scale}/>
							
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}