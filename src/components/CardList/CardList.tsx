'use client'

import cx from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { Button, ButtonGroup } from '@nextui-org/button'

import Watch from '@/components/Watch'
import CadenceWatch from '@/components/Watch/CadenceWatch'
import LapTable from '@/components/LapTable'
import { Changer, History } from '@/utils/type'

import {
  DEFAULT_DISTANCE,
  DEFAULT_TIME,
  DistanceTime,
} from '@/components/Watch/utils'
import {
  CadenceStride,
  DEFAULT_CADENCE,
  DEFAULT_STRIDE,
  getPace,
  getStride,
} from '@/components/Watch/cadenceUtils'

import styles from './CardList.module.css'

type CardListProps = {
  className?: string
}

type DistanceTimeCadence = [number, number, number]

type NumberListChanger = Changer<[number, number]>

type WatchLock = 'distance' | 'pace' | 'time'
type CadenceWatchLock = 'cadence' | 'pace' | 'stride'

function CardList(props: CardListProps) {
  const { className } = props

  const [showPaceWatch, setShowPaceWatch] = useState(true)
  const [showCadenceWatch, setShowCadenceWatch] = useState(false)
  const [showLapTable, setShowLapTable] = useState(false)

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
        const nextDistanceTimeCadence =
          typeof distanceTimeChanger === 'function'
            ? distanceTimeChanger([currentDistance, currentTime])
            : distanceTimeChanger

        return [
          nextDistanceTimeCadence[0],
          nextDistanceTimeCadence[1],
          currentCadence,
        ]
      })
    },
    []
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
          'sm:items-stretch',
          'sm:flex-row'
        )}
      >
        <Watch
          distanceTime={distanceTime}
          setDistanceTime={setDistanceTime}
          lock={watchLock}
          setLock={setWatchLock}
          unlock={unlockWatchLock}
        />
        {showCadenceWatch && (
          <CadenceWatch
            cadenceStride={cadenceStride}
            setCadenceStride={setCadenceStride}
            lock={cadenceWatchLock}
            setLock={setCadenceWatchLock}
            unlock={unlockCadenceWatchLock}
          />
        )}
        {showLapTable && <LapTable pace={pace} />}
      </div>
      <div className={cx('flex', 'gap-2')}>
        <Button
          className={cx('border-small')}
          variant={showPaceWatch ? 'flat' : 'light'}
          radius="full"
        >
          PACE
        </Button>
        <Button
          className={cx('border-small')}
          variant={showCadenceWatch ? 'flat' : 'light'}
          radius="full"
          onClick={() => {
            setShowCadenceWatch((current) => !current)
          }}
        >
          CADENCE
        </Button>
        <Button
          className={cx('border-small')}
          variant={showLapTable ? 'flat' : 'light'}
          radius="full"
          onClick={() => {
            setShowLapTable((current) => !current)
          }}
        >
          LAP
        </Button>
      </div>
    </div>
  )
}

export default CardList
