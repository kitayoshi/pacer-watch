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
  parseISO,
  setDay,
  setWeek,
  startOfMonth,
} from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Link } from '@nextui-org/link'
import { Divider } from '@nextui-org/divider'

import { Activity } from '@/utils/log'
import { formatDistance, formatPace, formatTime } from '@/utils/unit'

import styles from './MonthLogTable.module.css'
import { StravaBestEffortCamel } from '@/utils/strava'

type BestEffort = {
  name: string
  displayName: string
  distance: number
  elapsedTime: number
}

const initialBestEffortList: BestEffort[] = [
  ['5k', '5K'],
  ['10k', '10K'],
  ['Half-Marathon', 'HALF'],
  ['Marathon', 'FULL'],
].map(([name, displayName]) => ({
  name,
  displayName,
  distance: 0,
  elapsedTime: 0,
  activityId: 0,
}))

type DayBlockProps = {
  quantile: [number, number, number, number, number]
  activityList: Activity[]
  bestEffortList: (BestEffort & StravaBestEffortCamel)[]
  year: number
  month: number
  weekday: number
  week: number
  onSelect?: (activity: Activity) => void
}

function DayBlock(props: DayBlockProps) {
  const {
    quantile,
    activityList,
    bestEffortList,
    year,
    month,
    weekday,
    week,
    onSelect,
  } = props
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
    const dayActivityList = activityList.filter((a) => {
      return isSameDay(parseISO(a.startDate), date)
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

  const hasBestEffort = useMemo(() => {
    const hasBestEffort = dayActivityList.reduce((acc, cur) => {
      if (!cur.bestEfforts) return acc
      return acc || bestEffortList.some((be) => be.activity.id === cur.id)
    }, false)
    return hasBestEffort
  }, [dayActivityList, bestEffortList])

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cx(styles.dayBlock, {
            [styles.dayBlockEmpty]: !showDayBlock,
            [styles.dayBlockHasActivity]:
              showDayBlock && dayActivityList.length,
            [styles.dayBlock100]: showDayBlock && distancePreset === 100,
            [styles.dayBlock75]: showDayBlock && distancePreset === 75,
            [styles.dayBlock50]: showDayBlock && distancePreset === 50,
            [styles.dayBlock25]: showDayBlock && distancePreset === 25,
            [styles.dayBlockHasBestEffort]: showDayBlock && hasBestEffort,
          })}
          date-year={year}
          date-month={month}
          date-weekday={weekday}
          date-week={week}
          data-date-value={distance}
          data-date-key={dateKey}
        ></div>
      </PopoverTrigger>
      <PopoverContent>
        <div className={styles.popoverContainter}>
          <div className={styles.popoverDate}>{dateKey}</div>
          {dayActivityList.map((activity) => {
            const pace = activity.movingTime / activity.distance
            const activityLink = `https://www.strava.com/activities/${activity.id}`

            return (
              <div key={activity.id} className={styles.popoverActivity}>
                <Link
                  className={styles.popoverActivityDetail}
                  onClick={() => {
                    onSelect?.(activity)
                  }}
                >
                  {formatDistance(activity.distance)} | {formatPace(pace)} |{' '}
                  {formatTime(activity.movingTime)}
                </Link>
                <Link
                  className={styles.popoverActivityLink}
                  isExternal
                  showAnchorIcon
                  href={activityLink}
                >
                  DETAIL
                </Link>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

type MonthLogTableProps = {
  className?: string
  year: number // yyyy
  activityList: Activity[]
  onSelect?: (activity: Activity) => void
}

const weekdayList = [1, 2, 3, 4, 5, 6, 0]
const monthList = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
]

function MonthLogTable(props: MonthLogTableProps) {
  const { className, year, activityList, onSelect } = props

  const getMonthDistanceText = useCallback(
    (month: number) => {
      const monthActivityList = activityList.filter((a) => {
        return getMonth(parseISO(a.startDate)) === month
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

  const bestEffortList = useMemo(() => {
    const bestEffortList = activityList.reduce((acc, cur) => {
      if (!cur.bestEfforts) return acc
      return acc.map((bestEffort) => {
        const curBestEffort = cur.bestEfforts?.find(
          (be) => be.name === bestEffort.name
        )
        if (!curBestEffort) return bestEffort
        if (
          !bestEffort.distance ||
          curBestEffort.elapsedTime < bestEffort.elapsedTime
        ) {
          return { ...bestEffort, ...curBestEffort }
        }
        return bestEffort
      })
    }, initialBestEffortList)
    // HACK: type cast
    return bestEffortList.filter(
      (bestEffort) => bestEffort.distance > 0
    ) as (StravaBestEffortCamel & BestEffort)[]
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
                                  onSelect={onSelect}
                                  bestEffortList={bestEffortList}
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
      {bestEffortList.length > 0 && (
        <div>
          <Divider className="my-4" />
          {bestEffortList.map((bestEffort) => {
            return (
              <div key={bestEffort.name} className={styles.bestListItem}>
                <div>{bestEffort.displayName}</div>
                <div className={styles.bestDate}>
                  {bestEffort.startDateLocal.split('T')[0]}
                </div>
                <div>
                  <strong>{formatTime(bestEffort.elapsedTime)}</strong> @{' '}
                  {formatPace(bestEffort.elapsedTime / bestEffort.distance)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MonthLogTable
