'use client'

import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup } from '@nextui-org/button'

import Watch from '@/components/Watch'
import CadenceWatch from '@/components/Watch/CadenceWatch'
import LapTable from '@/components/LapTable'
import LogCard from '@/components/LogCard'
import BmiWatch from '@/components/Watch/BmiWatch'
import { Changer, History } from '@/utils/type'

import {
  DEFAULT_DISTANCE,
  DEFAULT_TIME,
  DistanceTime,
} from '@/components/Watch/utils'
import {
  CadenceStride,
  DEFAULT_CADENCE,
  getCadence,
  getPace,
  getStride,
} from '@/components/Watch/cadenceUtils'
import { Activity } from '@/utils/log'

import styles from './CardList.module.css'

type CardListProps = {
  className?: string
}

type DistanceTimeCadence = [number, number, number]

type NumberListChanger = Changer<[number, number]>

type WatchLock = 'distance' | 'pace' | 'time'
type CadenceWatchLock = 'cadence' | 'pace' | 'stride'

type CardType = 'pace' | 'cadence' | 'lap' | 'log' | 'bmi'

const buttonList: { type: CardType; label: string }[] = [
  { type: 'pace', label: 'PACE' },
  { type: 'cadence', label: 'CADENCE' },
  { type: 'lap', label: 'LAP' },
  { type: 'log', label: 'LOG' },
  { type: 'bmi', label: 'BMI' },
]

function CardList(props: CardListProps) {
  const { className } = props

  const [showCardList, setShowCardList] = useState<CardType[]>(['pace'])

  const [watchLockHistoryList, setWatchLockHistoryList] = useState<
    [History<WatchLock>, History<CadenceWatchLock>]
  >([
    { current: 'distance', last: 'pace' },
    { current: 'cadence', last: 'pace' },
  ])

  const [distanceTimeCadence, setDistanceTimeCadence] =
    useState<DistanceTimeCadence>([
      DEFAULT_DISTANCE,
      DEFAULT_TIME,
      DEFAULT_CADENCE,
    ])

  // utilitiy
  const watchLock = useMemo<WatchLock>(
    () => watchLockHistoryList[0].current,
    [watchLockHistoryList]
  )
  const setWatchLock = useCallback((nextLock: WatchLock) => {
    setWatchLockHistoryList((current) => {
      const [currentWatchLockHistory, currentCadenceWatchLockHistory] = current

      // sync pace
      let nextCadenceWatchLockHistory = { ...currentCadenceWatchLockHistory }
      if (
        nextLock === 'pace' &&
        currentCadenceWatchLockHistory.current !== 'pace'
      ) {
        nextCadenceWatchLockHistory.last =
          currentCadenceWatchLockHistory.current
        nextCadenceWatchLockHistory.current = 'pace'
      }

      if (nextLock === currentWatchLockHistory.current) {
        return [currentWatchLockHistory, nextCadenceWatchLockHistory]
      }

      return [
        { current: nextLock, last: currentWatchLockHistory.current },
        nextCadenceWatchLockHistory,
      ]
    })
  }, [])
  const unlockWatchLock = useCallback((changing: WatchLock) => {
    setWatchLockHistoryList((current) => {
      const [currentWatchLockHistory, currentCadenceWatchLockHistory] = current

      // sync pace
      let nextCadenceWatchLockHistory = { ...currentCadenceWatchLockHistory }
      if (
        changing === 'pace' &&
        currentCadenceWatchLockHistory.current === 'pace'
      ) {
        nextCadenceWatchLockHistory.current = nextCadenceWatchLockHistory.last
        nextCadenceWatchLockHistory.last = 'pace'
      }

      if (changing !== currentWatchLockHistory.current) {
        return [
          { current: currentWatchLockHistory.current, last: changing },
          nextCadenceWatchLockHistory,
        ]
      }

      return [
        { current: currentWatchLockHistory.last, last: changing },
        nextCadenceWatchLockHistory,
      ]
    })
  }, [])

  const cadenceWatchLock = useMemo<CadenceWatchLock>(
    () => watchLockHistoryList[1].current,
    [watchLockHistoryList]
  )
  const setCadenceWatchLock = useCallback((nextLock: CadenceWatchLock) => {
    setWatchLockHistoryList((current) => {
      const [currentWatchLockHistory, currentCadenceWatchLockHistory] = current

      // sync pace
      let nextWatchLockHistory = { ...currentWatchLockHistory }
      if (
        nextLock === 'pace' &&
        currentCadenceWatchLockHistory.current !== 'pace'
      ) {
        nextWatchLockHistory.last = currentWatchLockHistory.current
        nextWatchLockHistory.current = 'pace'
      }

      if (nextLock === currentCadenceWatchLockHistory.current) {
        return [nextWatchLockHistory, currentCadenceWatchLockHistory]
      }

      return [
        nextWatchLockHistory,
        { current: nextLock, last: currentCadenceWatchLockHistory.current },
      ]
    })
  }, [])
  const unlockCadenceWatchLock = useCallback((changing: CadenceWatchLock) => {
    setWatchLockHistoryList((current) => {
      const [currentWatchLockHistory, currentCadenceWatchLockHistory] = current

      // sync pace
      let nextWatchLockHistory = { ...currentWatchLockHistory }
      if (changing === 'pace' && currentWatchLockHistory.current === 'pace') {
        nextWatchLockHistory.current = nextWatchLockHistory.last
        nextWatchLockHistory.last = 'pace'
      }

      if (changing !== currentCadenceWatchLockHistory.current) {
        return [
          nextWatchLockHistory,
          { current: currentCadenceWatchLockHistory.current, last: changing },
        ]
      }

      return [
        nextWatchLockHistory,
        { current: currentCadenceWatchLockHistory.last, last: changing },
      ]
    })
  }, [])

  const distanceTime = useMemo<DistanceTime>(
    () => [distanceTimeCadence[0], distanceTimeCadence[1]],
    [distanceTimeCadence]
  )
  const setDistanceTime = useCallback(
    (distanceTimeChanger: NumberListChanger) => {
      setDistanceTimeCadence((currentDistanceTimeCadence) => {
        const [currentDistance, currentTime, currentCadence] =
          currentDistanceTimeCadence
        const currentPace = currentTime / currentDistance
        const nextDistanceTimeCadence =
          typeof distanceTimeChanger === 'function'
            ? distanceTimeChanger([currentDistance, currentTime])
            : distanceTimeChanger

        const [nextDistance, nextTime] = nextDistanceTimeCadence

        if (watchLockHistoryList[1].current === 'stride') {
          const currentStride = getStride(currentPace, currentCadence)
          const nextPace = nextTime / nextDistance
          const nextCadence = getCadence(nextPace, currentStride)
          return [
            nextDistanceTimeCadence[0],
            nextDistanceTimeCadence[1],
            nextCadence,
          ]
        }

        return [nextDistance, nextTime, currentCadence]
      })
    },
    [watchLockHistoryList]
  )

  const [distance, time, cadence] = distanceTimeCadence
  const pace = useMemo(() => time / distance, [distance, time])

  const stride = useMemo(() => getStride(pace, cadence), [pace, cadence])

  const cadenceStride = useMemo<CadenceStride>(
    () => [cadence, stride],
    [cadence, stride]
  )
  const setCadenceStride = useCallback(
    (cadenceStrideChanger: NumberListChanger) => {
      setDistanceTimeCadence((currentDistanceTimeCadence) => {
        const [currentDistance, currentTime, currentCadence] =
          currentDistanceTimeCadence
        const currentPace = currentTime / currentDistance
        const currentStride = getStride(currentPace, currentCadence)

        const nextCadeneStride =
          typeof cadenceStrideChanger === 'function'
            ? cadenceStrideChanger([currentCadence, currentStride])
            : cadenceStrideChanger
        const [nextCadence, nextStride] = nextCadeneStride
        const nextPace = getPace(nextCadence, nextStride)

        if (watchLockHistoryList[0].current === 'distance') {
          const nextTime = nextPace * currentDistance
          return [currentDistance, nextTime, nextCadence]
        }
        const nextDistance = currentTime / nextPace
        return [nextDistance, currentTime, nextCadence]
      })
    },
    [watchLockHistoryList]
  )

  const toogleWatch = useCallback(
    (cardType: CardType) => {
      if (showCardList.includes(cardType) && showCardList.length === 1) {
        return
      }
      if (showCardList.includes(cardType)) {
        setShowCardList((current) =>
          current.filter((type) => type !== cardType)
        )
        return
      }
      setShowCardList((current) => [...current, cardType])
    },
    [showCardList]
  )

  const onLogSelect = useCallback((activity: Activity) => {
    if (!activity) return
    setDistanceTimeCadence((currentDistanceTimeCadence) => {
      const [, , currentCadence] = currentDistanceTimeCadence

      const nextDistance = activity.distance
      const nextTime = activity.movingTime

      let nextCadence = currentCadence
      if (activity.averageCadence) {
        nextCadence = activity.averageCadence * 2
      }

      return [nextDistance, nextTime, nextCadence]
    })
  }, [])

  return (
    <div
      className={cx(
        styles.container,
        className,
        'flex',
        'flex-col',
        'items-center',
        'gap-6',
        'sm:my-auto'
      )}
    >
      <div
        className={cx(
          styles.cardList,
          'flex',
          'flex-col',
          'items-center',
          'sm:items-start',
          'sm:flex-row'
        )}
      >
        {showCardList.includes('pace') && (
          <Watch
            className={styles.card}
            distanceTime={distanceTime}
            setDistanceTime={setDistanceTime}
            lock={watchLock}
            setLock={setWatchLock}
            unlock={unlockWatchLock}
          />
        )}
        {showCardList.includes('cadence') && (
          <CadenceWatch
            className={styles.card}
            cadenceStride={cadenceStride}
            setCadenceStride={setCadenceStride}
            lock={cadenceWatchLock}
            setLock={setCadenceWatchLock}
            unlock={unlockCadenceWatchLock}
          />
        )}
        {showCardList.includes('lap') && (
          <LapTable className={styles.card} pace={pace} />
        )}

        <LogCard
          className={styles.logCard}
          show={showCardList.includes('log')}
          onSelect={onLogSelect}
        />

        {showCardList.includes('bmi') && <BmiWatch className={styles.card} />}
      </div>
      <div className={cx('flex', 'flex-wrap', 'justify-center', 'gap-2')}>
        {buttonList.map(({ type, label }) => (
          <Button
            key={type}
            className={cx('border-small')}
            variant={showCardList.includes(type) ? 'flat' : 'light'}
            radius="full"
            onClick={() => {
              toogleWatch(type)
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CardList
