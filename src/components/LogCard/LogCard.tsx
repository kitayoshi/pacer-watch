'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '@nextui-org/card'

import ConnectStravaButton from '@/components/ConnectStravaButton'
import YearLogTable from '@/components/YearLogTable'

import { LogMapData } from '@/utils/log'

import styles from './LogCard.module.css'

type LogCardProps = {
  show?: boolean
  className?: string
}

function LogCard(props: LogCardProps) {
  const { show, className } = props
  const searchParams = useSearchParams()
  const router = useRouter()

  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>(
    null
  )
  useEffect(() => {
    const setStravaAccessTokenQuery = searchParams.get(
      'set_strava_access_token'
    )
    if (setStravaAccessTokenQuery) {
      localStorage.setItem(
        'PACER_WATCH::stravaAccessToken',
        setStravaAccessTokenQuery
      )
      router.replace('/')
      return
    }
    const storageToken = localStorage.getItem('PACER_WATCH::stravaAccessToken')
    setStravaAccessToken(storageToken)
  }, [router, searchParams])

  const [logMapData, setLogMapData] = useState<LogMapData>({
    logMap: {},
    quantile: [0, 0, 0, 0, 0],
  })
  const fetchData = useCallback(async (stravaAccessToken: string) => {
    const responseData = (await fetch('/api/strava-activities', {
      headers: {
        Authorization: `Bearer ${stravaAccessToken}`,
      },
    })
      .then((res) => res.json())
      .catch(() => {
        localStorage.removeItem('PACER_WATCH::stravaAccessToken')
        setStravaAccessToken(null)
      })) as LogMapData
    setLogMapData(responseData)
  }, [])
  useEffect(() => {
    if (!stravaAccessToken) return
    fetchData(stravaAccessToken)
  }, [fetchData, stravaAccessToken])

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
      {stravaAccessToken && (
        <>
          {yearList.map((year) => {
            return (
              <YearLogTable key={year} year={year} logMapData={logMapData} />
            )
          })}
        </>
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
