'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { Card } from '@nextui-org/card'

import cx from 'classnames'
import { Lato } from 'next/font/google'

import PaceNumber from '@/components/PaceNumber'
import DistanceNumber from '@/components/DistanceNumber'
import TimeNumber from '@/components/TimeNumber'
import Knob from '@/components/Knob'

import { LockButton, MinusButton, PlusButton } from './EditButton'

import {
  DEFAULT_DISTANCE,
  DEFAULT_TIME,
  DEFAULT_DISTANCE_BASE,
  DEFAULT_TIME_BASE,
  DISTANCE_KNOB_STEP,
  PACE_KNOB_STEP,
  TIME_KNOB_STEP,
  DISTANCE_OPTION_LIST,
  PACE_OPTION_LIST,
  TIME_OPTION_LIST,
} from './utils'

import SelectModal from './SelectModal'
import SelectNumber from './SelectNumber'

import styles from './Watch.module.css'

const fontKnob = Lato({ weight: '700', subsets: ['latin'] })

type NumberChanger = number | ((nextNumber: number) => number)

type Lock = 'distance' | 'pace' | 'time'

type WatchProps = {
  className?: string
}

function Watch(props: WatchProps) {
  const { className } = props

  // base value
  const [distanceBase, setDistanceBase] = useState(DEFAULT_DISTANCE_BASE)
  const [timeBase, setTimeBase] = useState(DEFAULT_TIME_BASE)
  const paceBase = useMemo(
    () => timeBase / distanceBase,
    [distanceBase, timeBase]
  )

  // value state
  const [distanceTime, setDistanceTime] = useState([
    DEFAULT_DISTANCE,
    DEFAULT_TIME,
  ])

  // lock
  const [lock, setLock] = useState<Lock>('distance')
  const [lastChange, setLastChange] = useState<Lock>('pace')

  // utilitiy
  const [distance, time] = distanceTime
  const pace = useMemo(() => time / distance, [distance, time])

  const changeDistance = useCallback(
    (distanceChanger: NumberChanger) => {
      setLastChange('distance')
      setDistanceTime(([currentDistance, currentTime]) => {
        const nextDistance =
          typeof distanceChanger === 'function'
            ? distanceChanger(currentDistance)
            : distanceChanger

        if (lock === 'pace') {
          const currentPace = currentTime / currentDistance
          const nextTime = nextDistance * currentPace
          return [nextDistance, nextTime]
        }

        return [nextDistance, currentTime]
      })
    },
    [lock]
  )
  const changeTime = useCallback(
    (timeChanger: NumberChanger) => {
      setLastChange('time')
      setDistanceTime(([currentDistance, currentTime]) => {
        const nextTime =
          typeof timeChanger === 'function'
            ? timeChanger(currentTime)
            : timeChanger
        if (lock === 'pace') {
          const currentPace = currentTime / currentDistance
          const nextDistance = nextTime / currentPace
          return [nextDistance, nextTime]
        }
        return [currentDistance, nextTime]
      })
    },
    [lock]
  )
  const changePace = useCallback(
    (paceChanger: NumberChanger) => {
      setLastChange('pace')
      setDistanceTime(([currentDistance, currentTime]) => {
        const currentPace = currentTime / currentDistance
        const nextPace =
          typeof paceChanger === 'function'
            ? paceChanger(currentPace)
            : paceChanger

        if (lock === 'pace') {
          setLock(lastChange)
          return [currentDistance, currentTime]
        }

        if (lock === 'distance') {
          const nextTime = currentDistance * nextPace
          return [currentDistance, nextTime]
        }

        if (lock === 'time') {
          const nextDistance = currentTime / nextPace
          return [nextDistance, currentTime]
        }

        return [currentDistance, currentTime]
      })
      return
    },
    [lock, lastChange]
  )
  const unlock = useCallback(
    (locking: Lock) => {
      if (locking === 'distance' && lock === 'distance') {
        setLock(lastChange === 'distance' ? 'pace' : lastChange)
      }
      if (locking === 'pace' && lock === 'pace') {
        setLock(lastChange === 'pace' ? 'distance' : lastChange)
      }
      if (locking === 'time' && lock === 'time') {
        setLock(lastChange === 'time' ? 'distance' : lastChange)
      }
    },
    [lock, lastChange]
  )

  // distance
  const [rotateDistance, setRotateDistance] = useState<number | null>(null)
  const [showDistanceModal, setShowDistanceModal] = useState(false)
  const [disatanceModalSelected, setDisatanceModalSelected] = useState(false)
  const onDistanceRotateStart = useCallback(() => {
    setShowDistanceModal(true)
  }, [])
  const onDistanceRotateEnd = useCallback(() => {
    changeDistance((distance) => Math.floor(distance))
    setRotateDistance(null)
    setShowDistanceModal(false)
    setDisatanceModalSelected(false)
  }, [changeDistance])
  const onDistanceRotate = useCallback(
    (nextDistance: number, disabled: boolean) => {
      if (!disabled) changeDistance(nextDistance)
      setRotateDistance(nextDistance)
    },
    [changeDistance]
  )
  const onDisntanceModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setDisatanceModalSelected(false)
        return
      }
      setDisatanceModalSelected(true)
      changeDistance(value)
    },
    [changeDistance]
  )
  const distanceKnobDisabled = useMemo(
    () => lock === 'distance' || disatanceModalSelected,
    [lock, disatanceModalSelected]
  )

  // pace
  const [rotatePace, setRotatePace] = useState<number | null>(null)
  const [showPaceModal, setShowPaceModal] = useState(false)
  const [paceModalSelected, setPaceModalSelected] = useState(false)
  const onPaceRotateStart = useCallback(() => {
    setShowPaceModal(true)
  }, [])
  const onPaceRotateEnd = useCallback(() => {
    changePace((pace) => Math.floor(pace * 1000) / 1000)
    setRotatePace(null)
    setShowPaceModal(false)
    setPaceModalSelected(false)
  }, [changePace])
  const onPaceRotate = useCallback(
    (nextPace: number, disabled: boolean) => {
      if (!disabled) changePace(nextPace)
      setRotatePace(nextPace)
    },
    [changePace]
  )
  const onPaceModalChange = useCallback(
    async (value: number | null) => {
      if (value === null) {
        setPaceModalSelected(false)
        return
      }
      setPaceModalSelected(true)
      changePace(value)
    },
    [changePace]
  )
  const paceKnobDisabled = useMemo(
    () => lock === 'pace' || paceModalSelected,
    [lock, paceModalSelected]
  )

  // time
  const [rotateTime, setRotateTime] = useState<number | null>(null)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [timeModalSelected, setTimeModalSelected] = useState(false)
  const onTimeRotateStart = useCallback(() => {
    setShowTimeModal(true)
  }, [])
  const onTimeRotateEnd = useCallback(() => {
    changeTime((time) => Math.floor(time))
    setRotateTime(null)
    setShowTimeModal(false)
    setTimeModalSelected(false)
  }, [changeTime])
  const onTimeRotate = useCallback(
    (nextTime: number, disabled: boolean) => {
      if (!disabled) changeTime(nextTime)
      setRotateTime(nextTime)
    },
    [changeTime]
  )
  const onTimeModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setTimeModalSelected(false)
        return
      }
      setTimeModalSelected(true)
      changeTime(value)
    },
    [changeTime]
  )
  const timeKnobDisabled = useMemo(
    () => lock === 'time' || timeModalSelected,
    [lock, timeModalSelected]
  )

  return (
    <Card className={cx(styles.container, className)}>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>PACER.WATCH</div>
      </div>

      <div className={styles.numberArea}>
        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="DISTANCE"
            value={distance}
            optionList={DISTANCE_OPTION_LIST}
            onChange={(nextDistance) => {
              unlock('distance')
              changeDistance(nextDistance)
            }}
          />
          <DistanceNumber className={styles.number} distance={distance} />
        </div>

        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="PACE"
            value={pace}
            optionList={PACE_OPTION_LIST}
            onChange={(nextPace) => {
              unlock('pace')
              changePace(nextPace)
            }}
          />
          <PaceNumber className={styles.number} pace={pace} />
        </div>

        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="TIME"
            value={time}
            optionList={TIME_OPTION_LIST}
            onChange={(nextTime) => {
              unlock('time')
              changeTime(nextTime)
            }}
          />
          <TimeNumber className={styles.number} time={time} />
        </div>
      </div>

      <div className={styles.buttonArea}>
        <div className={styles.buttonContainer}>
          <Knob
            disabled={distanceKnobDisabled}
            baseValue={distanceBase}
            value={distance}
            step={DISTANCE_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('distance')
            }}
            onRotate={onDistanceRotate}
            onRotateStart={onDistanceRotateStart}
            onRotateEnd={onDistanceRotateEnd}
          />
          <LockButton
            className={styles.lockButton}
            locked={lock === 'distance'}
            onClick={() => {
              if (lock === 'distance') return
              setLock('distance')
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Knob
            disabled={paceKnobDisabled}
            baseValue={paceBase}
            value={pace}
            step={PACE_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('pace')
            }}
            onRotate={onPaceRotate}
            onRotateStart={onPaceRotateStart}
            onRotateEnd={onPaceRotateEnd}
          />
          {/* <div className={cx(fontKnob.className, styles.buttonText)}>PACE</div> */}
          <LockButton
            className={styles.lockButton}
            locked={lock === 'pace'}
            onClick={() => {
              if (lock === 'pace') return
              setLock('pace')
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Knob
            disabled={timeKnobDisabled}
            baseValue={timeBase}
            value={time}
            step={TIME_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('time')
            }}
            onRotate={onTimeRotate}
            onRotateStart={onTimeRotateStart}
            onRotateEnd={onTimeRotateEnd}
          />

          {/* <div className={cx(fontKnob.className, styles.buttonText)}>TIME</div> */}
          <LockButton
            className={styles.lockButton}
            locked={lock === 'time'}
            onClick={() => {
              if (lock === 'time') return
              setLock('time')
            }}
          />
        </div>
      </div>

      <SelectModal
        label="DISTANCE"
        nearValue={rotateDistance}
        optionList={DISTANCE_OPTION_LIST}
        isOpen={showDistanceModal}
        onSelect={onDisntanceModalChange}
      />

      <SelectModal
        label="PACE"
        nearValue={rotatePace}
        optionList={PACE_OPTION_LIST}
        isOpen={showPaceModal}
        onSelect={onPaceModalChange}
      />

      <SelectModal
        label="TIME"
        nearValue={rotateTime}
        optionList={TIME_OPTION_LIST}
        isOpen={showTimeModal}
        onSelect={onTimeModalChange}
      />
    </Card>
  )
}

export default Watch
