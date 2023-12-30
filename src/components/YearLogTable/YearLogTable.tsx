import { useMemo } from 'react'
import cx from 'classnames'
import { format, getMonth, getYear, isSameDay, setDay, setWeek } from 'date-fns'

import { Activity } from '@/utils/log'

import styles from './YearLogTable.module.css'
import { quantileSeq } from 'mathjs'

type DayBlockProps = {
  quantile: [number, number, number, number, number]
  activityList: Activity[]
  year: number
  weekday: number
  week: number
  onHover?: (activity: Activity) => void
}

function DayBlock(props: DayBlockProps) {
  const { quantile, activityList, year, weekday, week, onHover } = props
  const date = useMemo(() => {
    const date = setDay(
      setWeek(new Date(Number(year), 0, 1), week, { weekStartsOn: 1 }),
      weekday,
      { weekStartsOn: 1 }
    )
    return date
  }, [year, weekday, week])
  const dateKey = useMemo(() => format(date, 'yyyy-MM-dd'), [date])
  const dayActivityList = useMemo(() => {
    const dayActivityList = activityList.filter((activity) => {
      return isSameDay(new Date(activity.startDateLocal), date)
    })
    return dayActivityList
  }, [activityList, date])

  const distance = useMemo(() => {
    const distance = dayActivityList.reduce((acc, cur) => acc + cur.distance, 0)
    return distance
  }, [dayActivityList])

  const distancePreset = useMemo(() => {
    if (!distance) return null
    if (distance >= quantile[3]) return 100
    if (distance >= quantile[2]) return 75
    if (distance >= quantile[1]) return 50
    if (distance >= 0) return 25
  }, [distance, quantile])

  const showDayBlock = useMemo(() => {
    if (getYear(date) !== year) return false
    return true
  }, [date, year])

  return (
    <div
      className={cx(styles.dayBlock, {
        [styles.dayBlockEmpty]: !showDayBlock,
        [styles.dayBlock100]: showDayBlock && distancePreset === 100,
        [styles.dayBlock75]: showDayBlock && distancePreset === 75,
        [styles.dayBlock50]: showDayBlock && distancePreset === 50,
        [styles.dayBlock25]: showDayBlock && distancePreset === 25,
      })}
      date-year={year}
      date-weekday={weekday}
      date-week={week}
      data-date-value={distance}
      data-date-key={dateKey}
      onPointerEnter={() => {
        if (!showDayBlock) return
        onHover?.(dayActivityList[0])
      }}
    ></div>
  )
}

type YearLogTableProps = {
  year: number // yyyy
  activityList: Activity[]
}

const weekdayList = [0, 1, 2, 3, 4, 5, 6]
const weekList = Array.from({ length: 53 }, (_, i) => i + 1)

function YearLogTable(props: YearLogTableProps) {
  const { year, activityList } = props

  const quantile = useMemo(() => {
    return quantileSeq(
      activityList.length
        ? activityList.map((activity) => activity.distance)
        : [0],
      [0, 0.25, 0.5, 0.75, 1]
    ) as [number, number, number, number, number]
  }, [activityList])

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
                    activityList={activityList}
                    quantile={quantile}
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
