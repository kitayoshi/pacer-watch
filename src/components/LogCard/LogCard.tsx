'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { getYear, parseISO } from 'date-fns'
import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@nextui-org/card'
import { Select, SelectItem } from '@nextui-org/select'
import { Button } from '@nextui-org/button'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Spinner } from '@nextui-org/spinner'

import SyncImage from '@material-design-icons/svg/filled/sync.svg'

import ConnectStravaButton from '@/components/ConnectStravaButton'
import MonthLogTable from '@/components/MonthLogTable'

import { Activity, Athlete } from '@/utils/log'
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
  const [stravaAccessToken, setStravaAccessToken] = useState<
    string | null | undefined
  >(undefined)
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

  const [stravaAthlete, setStravaAthlete] = useState<Athlete | null>(null)
  const fetchAthlete = useCallback(async (stravaAccessToken: string) => {
    if (!stravaAccessToken) return
    const athlete: Athlete = await fetch('/api/strava-athlete', {
      headers: {
        ['x-strava-access-token']: stravaAccessToken,
      },
    })
      .then((res) => res.json())
      .catch(() => {
        localStorage.removeItem('PACER_WATCH::stravaAccessToken')
        setStravaAccessToken(null)
        return null
      })
    setStravaAthlete(athlete)
  }, [])
  useEffect(() => {
    if (!stravaAccessToken) return
    fetchAthlete(stravaAccessToken)
  }, [fetchAthlete, stravaAccessToken])

  const [fetching, setFetching] = useState(false)
  const [activityList, setActivityList] = useState<Activity[]>([])
  const fetchData = useCallback(
    async (
      stravaAthleteId: number,
      stravaAccessToken: string,
      refresh?: boolean
    ) => {
      setFetching(true)
      const url = new URL('/api/strava-activity-list', window.location.origin)
      if (refresh) url.searchParams.set('refresh', '1')

      const responseData: Activity[] = await fetch(url, {
        headers: {
          ['x-strava-athlete-id']: String(stravaAthleteId),
          ['x-strava-access-token']: stravaAccessToken,
        },
      })
        .then((res) => res.json())
        .catch(() => {
          localStorage.removeItem('PACER_WATCH::stravaAccessToken')
          setStravaAccessToken(null)
          return []
        })
      setFetching(false)
      setActivityList(responseData.filter((a) => a.type === 'Run'))
    },
    []
  )
  useEffect(() => {
    if (!stravaAthleteId || !stravaAccessToken) return
    fetchData(stravaAthleteId, stravaAccessToken)
  }, [fetchData, stravaAthleteId, stravaAccessToken])

  const [year, setYear] = useState(2024)
  const yearList = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return getYearList(currentYear, 2)
  }, [])

  const currentYearActivityList = useMemo(() => {
    return activityList.filter((a) => getYear(parseISO(a.startDate)) === year)
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
    <div id="log-card" className={cx(styles.container, className)}>
      <Card className={styles.card}>
        <div className={styles.navbar}>
          <div className={styles.navbarHeader}>RUNNING LOG</div>
        </div>
        <div className={styles.toolButtonList}>
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
              disabled={fetching}
            >
              <SyncImage className={styles.icon} fill="currentColor" />
            </Button>
          )}
        </div>
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
            onSelect={async (activity) => {
              onSelect?.(activity)

              if (activity.resourceState === 3) return
              if (!stravaAthleteId || !stravaAccessToken) return
              const url = new URL(
                '/api/strava-activity',
                window.location.origin
              )
              url.searchParams.set('id', String(activity.id))
              const responseData: Activity = await fetch(url, {
                headers: {
                  ['x-strava-athlete-id']: String(stravaAthleteId),
                  ['x-strava-access-token']: stravaAccessToken,
                },
              }).then((res) => res.json())
              setActivityList((prev) =>
                prev.map((a) => (a.id === activity.id ? responseData : a))
              )
            }}
            athelete={stravaAthlete}
          />
          {fetching && (
            <div className={styles.buttonContainer}>
              <Spinner size="sm" color="default" />
            </div>
          )}
          {stravaAccessToken === null && (
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
    </div>
  )
}

export default LogCard
