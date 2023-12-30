'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { isSameYear, parseISO } from 'date-fns'
import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@nextui-org/card'
import { Select, SelectItem } from '@nextui-org/select'
import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'

import SyncImage from '@material-design-icons/svg/filled/sync.svg'

import ConnectStravaButton from '@/components/ConnectStravaButton'
import MonthLogTable from '@/components/MonthLogTable'

import { Activity } from '@/utils/log'
import { formatDistance } from '@/utils/unit'
import { getYearList } from '@/utils/time'

import styles from './LogCard.module.css'

const STRAVA_ACCESS_TOKEN_KEY = 'PACER_WATCH::stravaAccessToken'
const STRAVA_ATHLETE_ID_KEY = 'PACER_WATCH::stravaAthleteId'

type LogCardProps = {
  show?: boolean
  className?: string
  onSelect?: (activity: Activity) => void
}

function LogCard(props: LogCardProps) {
  const { show, className, onSelect } = props
  const searchParams = useSearchParams()
  const router = useRouter()

  const [stravaError, setStravaError] = useState<string | null>(null)
  const [stravaAthleteId, setStravaAthleteId] = useState<number | null>(null)
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>(
    null
  )
  useEffect(() => {
    const setStravaTokenQuery = searchParams.get('set_strava_token')
    if (setStravaTokenQuery?.startsWith('error')) {
      setStravaError(setStravaTokenQuery.split('error:')[1])
      router.replace('/')
      return
    }
    if (setStravaTokenQuery) {
      const [athleteId, accessToken] = setStravaTokenQuery.split('.')
      localStorage.setItem(STRAVA_ATHLETE_ID_KEY, athleteId)
      localStorage.setItem(STRAVA_ACCESS_TOKEN_KEY, accessToken)
      router.replace('/')
      return
    }
    const storageAthleteId = localStorage.getItem(STRAVA_ATHLETE_ID_KEY)
    setStravaAthleteId(storageAthleteId ? Number(storageAthleteId) : null)
    const storageToken = localStorage.getItem('PACER_WATCH::stravaAccessToken')
    setStravaAccessToken(storageToken)
  }, [router, searchParams])

  const [activityList, setActivityList] = useState<Activity[]>([])
  const fetchData = useCallback(
    async (
      stravaAthleteId: number,
      stravaAccessToken: string,
      refresh?: boolean
    ) => {
      const url = new URL('/api/strava-activities', window.location.origin)
      if (refresh) url.searchParams.set('refresh', '1')

      const responseData = (await fetch(url, {
        headers: {
          ['x-strava-athlete-id']: String(stravaAthleteId),
          ['x-strava-access-token']: stravaAccessToken,
        },
      })
        .then((res) => res.json())
        .catch(() => {
          localStorage.removeItem('PACER_WATCH::stravaAccessToken')
          setStravaAccessToken(null)
        })) as Activity[]
      setActivityList(responseData.filter((a) => a.type === 'Run'))
    },
    []
  )
  useEffect(() => {
    if (!stravaAthleteId || !stravaAccessToken) return
    fetchData(stravaAthleteId, stravaAccessToken)
  }, [fetchData, stravaAthleteId, stravaAccessToken])

  const [year, setYear] = useState(2023)
  const yearList = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return getYearList(currentYear, 1)
  }, [])

  const currentYearActivityList = useMemo(() => {
    return activityList.filter((a) => isSameYear(parseISO(a.startDate), year))
  }, [activityList, year])

  const totalDistanceText = useMemo(() => {
    const totalDistance = currentYearActivityList.reduce(
      (acc, cur) => acc + cur.distance,
      0
    )
    return formatDistance(totalDistance)
  }, [currentYearActivityList])

  if (!show) return null

  return (
    <Card className={cx(styles.container, className)}>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>TRAINING LOG</div>
      </div>
      {stravaAccessToken && (
        <Button
          className={styles.toolButton}
          isIconOnly
          size="sm"
          onClick={() => {
            if (!stravaAthleteId || !stravaAccessToken) return
            fetchData(stravaAthleteId, stravaAccessToken, true)
          }}
          variant="light"
          radius="full"
        >
          <SyncImage className={styles.icon} fill="currentColor" />
        </Button>
      )}
      <div className={styles.yearStat}>
        <Select
          className={styles.yearSelect}
          label=""
          aria-label="year"
          variant="flat"
          labelPlacement="outside"
          radius="full"
          size="sm"
          selectedKeys={[String(year)]}
          onSelectionChange={(keys) => setYear(Number(Array.from(keys)[0]))}
        >
          {yearList.map((year) => (
            <SelectItem key={String(year)} textValue={String(year)}>
              {year}
            </SelectItem>
          ))}
        </Select>
        <div
          className={styles.yearTotal}
        >{`${totalDistanceText} / ${currentYearActivityList.length}runs`}</div>
      </div>
      <div className={styles.content}>
        <MonthLogTable
          className={styles.monthLogTable}
          year={year}
          activityList={activityList}
          onSelect={onSelect}
        />
        {!stravaAccessToken && (
          <div className={styles.buttonContainer}>
            <Popover
              isOpen={Boolean(stravaError)}
              onOpenChange={() => setStravaError(null)}
              triggerScaleOnOpen={false}
            >
              <PopoverTrigger>
                <div>
                  <ConnectStravaButton />
                </div>
              </PopoverTrigger>
              <PopoverContent>{stravaError}</PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </Card>
  )
}

export default LogCard
