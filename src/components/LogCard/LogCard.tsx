'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@nextui-org/card'
import { Select, SelectItem } from '@nextui-org/select'

import ConnectStravaButton from '@/components/ConnectStravaButton'
import MonthLogTable from '@/components/MonthLogTable'

import { LogMapData } from '@/utils/log'

import styles from './LogCard.module.css'

const STRAVA_ACCESS_TOKEN_KEY = 'PACER_WATCH::stravaAccessToken'
const STRAVA_ATHLETE_ID_KEY = 'PACER_WATCH::stravaAthleteId'

type LogCardProps = {
  show?: boolean
  className?: string
}

function LogCard(props: LogCardProps) {
  const { show, className } = props
  const searchParams = useSearchParams()
  const router = useRouter()

  const [stravaAthleteId, setStravaAthleteId] = useState<number | null>(null)
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>(
    null
  )
  useEffect(() => {
    const setStravaTokenQuery = searchParams.get('set_strava_token')
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

  const [logMapData, setLogMapData] = useState<LogMapData>({
    logMap: {},
    quantile: [0, 0, 0, 0, 0],
  })
  const fetchData = useCallback(
    async (stravaAthleteId: number, stravaAccessToken: string) => {
      const responseData = (await fetch('/api/strava-activities', {
        headers: {
          ['x-strava-athlete-id']: String(stravaAthleteId),
          ['x-strava-access-token']: stravaAccessToken,
        },
      })
        .then((res) => res.json())
        .catch(() => {
          localStorage.removeItem('PACER_WATCH::stravaAccessToken')
          setStravaAccessToken(null)
        })) as LogMapData
      setLogMapData(responseData)
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
    const yearList = Array.from(
      { length: 5 },
      (_, i) => i + currentYear - 5 + 1
    ).reverse()
    return yearList
  }, [])

  if (!show) return null

  return (
    <Card className={cx(styles.container, className)}>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>YEAR JOURNAL</div>
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
        <div className={styles.yearTotal}>{'1234km\n200runs'}</div>
      </div>
      {stravaAccessToken && (
        <MonthLogTable
          className={styles.monthLogTable}
          year={year}
          logMapData={logMapData}
        />
      )}
      {!stravaAccessToken && (
        <div className={styles.buttonContainer}>
          <ConnectStravaButton />
        </div>
      )}
    </Card>
  )
}

export default LogCard
