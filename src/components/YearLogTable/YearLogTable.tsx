import { useMemo } from 'react'
import cx from 'classnames'
import { format, getYear, setDay, setWeek } from 'date-fns'

import { LogMapData } from '@/utils/log'

import styles from './YearLogTable.module.css'

type DayBlockProps = {
  logMapData: LogMapData
  year: number
  weekday: number
  week: number
}

function DayBlock(props: DayBlockProps) {
  const {
    logMapData: { logMap, quantile },
    year,
    weekday,
    week,
  } = props
  const date = useMemo(() => {
    const date = setDay(setWeek(new Date(Number(year), 0, 1), week), weekday)
    return date
  }, [year, weekday, week])
  const dateKey = useMemo(() => format(date, 'yyyy-MM-dd'), [date])
  const distance = useMemo(() => {
    const logData = (logMap[dateKey] || []).filter((log) => log.type === 'Run')
    const distance = logData.reduce((acc, cur) => acc + cur.distance, 0)
    return distance
  }, [logMap, dateKey])
  const distancePreset = useMemo(() => {
    if (!distance) return null
    if (distance >= quantile[3]) return 100
    if (distance >= quantile[2]) return 75
    if (distance >= quantile[1]) return 50
    if (distance >= 0) return 25
  }, [distance, quantile])

  return (
    <div
      className={cx(styles.dayBlock, {
        [styles.dayBlockEmpty]: getYear(date) !== year,
        [styles.dayBlock100]: distancePreset === 100,
        [styles.dayBlock75]: distancePreset === 75,
        [styles.dayBlock50]: distancePreset === 50,
        [styles.dayBlock25]: distancePreset === 25,
      })}
      data-date-value={distance}
      data-date-key={dateKey}
    ></div>
  )
}

type YearLogTableProps = {
  year: number // yyyy
  logMapData: LogMapData
}

const weekdayList = [0, 1, 2, 3, 4, 5, 6]
const weekList = Array.from({ length: 53 }, (_, i) => i + 1)

function YearLogTable(props: YearLogTableProps) {
  const { year, logMapData } = props

  return (
    <div className={styles.container}>
      <div className={styles.title}>{year}</div>
      <div className={styles.weekdayListContainer}>
        {weekdayList.map((weekday) => {
          return (
            <div key={weekday} className={styles.weekListContainer}>
              {weekList.map((week) => {
                return (
                  <DayBlock
                    key={week}
                    logMapData={logMapData}
                    year={year}
                    weekday={weekday}
                    week={week}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default YearLogTable
