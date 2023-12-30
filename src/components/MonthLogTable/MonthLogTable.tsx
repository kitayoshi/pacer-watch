import { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { quantileSeq } from 'mathjs'
import {
  format,
  getMonth,
  getWeek,
  getWeeksInMonth,
  getYear,
  isSameDay,
  setDay,
  setWeek,
  startOfMonth,
} from 'date-fns'

import { Activity } from '@/utils/log'
import { formatDistance } from '@/utils/unit'

import styles from './MonthLogTable.module.css'

type DayBlockProps = {
  quantile: [number, number, number, number, number]
  activityList: Activity[]
  year: number
  month: number
  weekday: number
  week: number
  onHover?: (activity: Activity) => void
}

function DayBlock(props: DayBlockProps) {
  const { quantile, activityList, year, month, weekday, week, onHover } = props
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
    if (getMonth(date) !== month) return false
    return true
  }, [date, year, month])

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
      date-month={month}
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

type MonthLogTableProps = {
  className?: string
  year: number // yyyy
  activityList: Activity[]
  onHover?: (activity: Activity) => void
}

const weekdayList = [1, 2, 3, 4, 5, 6, 0]
const monthList = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
]

function MonthLogTable(props: MonthLogTableProps) {
  const { className, year, activityList, onHover } = props

  const getMonthDistanceText = useCallback(
    (month: number) => {
      const monthActivityList = activityList.filter((activity) => {
        return getMonth(new Date(activity.startDateLocal)) === month
      })
      const distance = monthActivityList.reduce(
        (acc, cur) => acc + cur.distance,
        0
      )
      return formatDistance(distance)
    },
    [activityList]
  )

  const quantile = useMemo(() => {
    return quantileSeq(
      activityList.length
        ? activityList.map((activity) => activity.distance)
        : [0],
      [0, 0.25, 0.5, 0.75, 1]
    ) as [number, number, number, number, number]
  }, [activityList])

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.weekdayListContainer}>
        {monthList.map((columnMonthList, columnMonthIndex) => {
          return (
            <div key={columnMonthIndex} className={styles.columnMonthList}>
              {columnMonthList.map((month) => {
                const firstDayInMonth = startOfMonth(new Date(year, month, 1))
                const firstDayWeek = getWeek(firstDayInMonth, {
                  weekStartsOn: 1,
                })
                const weekListLength = getWeeksInMonth(new Date(year, month), {
                  weekStartsOn: 1,
                })
                const weekList = Array.from(
                  { length: weekListLength },
                  (_, i) => i + firstDayWeek
                )
                return (
                  <div key={month} className={styles.monthBlock}>
                    <div className={styles.monthStat}>
                      <div className={styles.monthTitle}>
                        {format(new Date(year, month), 'MMM')}
                      </div>
                      <div className={styles.monthCount}>
                        {getMonthDistanceText(month)}
                      </div>
                    </div>
                    <div className={styles.weekListContainer}>
                      {weekList.map((week) => {
                        return (
                          <div key={week} className={styles.weekList}>
                            {weekdayList.map((weekday) => {
                              return (
                                <DayBlock
                                  key={weekday}
                                  activityList={activityList}
                                  quantile={quantile}
                                  year={year}
                                  month={month}
                                  weekday={weekday}
                                  week={week}
                                  onHover={onHover}
                                />
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MonthLogTable
