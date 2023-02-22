import React from 'react'
import { Typography } from '@mui/material'
import styles from './MemberScheduleHeader.module.css'
import Icon from '../../../../assets/Icon'

type MemberScheduleHeaderProps = {
  member?: string
}

export const MemberScheduleHeader: React.FunctionComponent<
  MemberScheduleHeaderProps
> = (
  {
    /**member*/
  }
) => {
  /**
   * TODO: complete functionality for switching pages between individual and all shifts and date picker
   */

  return (
    <div className={styles.component}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Typography variant="h3" style={{ color: '#232323' }}>
            {' '}
            Schedule{' '}
          </Typography>
        </div>
        <div className={styles.bottom}>
          <div className={styles.pages}>
            <button className={styles.selectedPageButton}>
              <Typography
                variant="h6"
                style={{ fontWeight: 700, color: '#969696' }}
              >
                {' '}
                Individual{' '}
              </Typography>
            </button>
            <button className={styles.pageButton}>
              <Typography variant="h6" style={{ color: '#969696' }}>
                {' '}
                All shifts{' '}
              </Typography>
            </button>
          </div>
          <div className={styles.dates}>
            <div className={styles.dateSelector}>
              <Icon type="leftArrow" className={styles.icon} />
              <Typography variant="h6" className={styles.text}>
                Dec 20 - Dec 27
              </Typography>
              <Icon type="rightArrow" className={styles.icon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
