'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Select, SelectItem } from '@nextui-org/select'
import { Button } from '@nextui-org/button'

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

import styles from './Watch.module.css'
import SelectModal from './SelectModal'
import { timeout } from '@/utils/promise'

const fontKnob = Lato({ weight: '700', subsets: ['latin'] })

type NumberChanger = number | ((nextNumber: number) => number)

type Lock = 'distance' | 'pace' | 'time'

function Watch() {
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
    async (value: number | null) => {
      if (value === null) {
        setDisatanceModalSelected(false)
        return
      }
      setDisatanceModalSelected(true)
      await timeout(10)
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
      await timeout(10)
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
    async (value: number | null) => {
      if (value === null) {
        setTimeModalSelected(false)
        return
      }
      setTimeModalSelected(true)
      await timeout(10)
      changeTime(value)
    },
    [changeTime]
  )
  const timeKnobDisabled = useMemo(
    () => lock === 'time' || timeModalSelected,
    [lock, timeModalSelected]
  )

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>PACER.WATCH</div>

      <div className={styles.numberArea}>
        <DistanceNumber className={styles.number} distance={distance} />
        <PaceNumber className={styles.number} pace={pace} />
        <TimeNumber className={styles.number} time={time} />
      </div>

      <div className={styles.buttonArea}>
        <div className={styles.buttonContainer}>
          <Select
            className={styles.select}
            label="DISTANCE"
            selectedKeys={[
              DISTANCE_OPTION_LIST.find((o) => o.value === distance)?.text ??
                'FREE',
            ]}
            disabledKeys={['FREE']}
            onSelectionChange={(keys) => {
              const [key] = Array.from(keys)
              const nextDistance = DISTANCE_OPTION_LIST.find(
                (o) => o.text === key
              )?.value
              if (!nextDistance) return
              if (lock === 'distance' && lastChange !== 'distance') {
                setLock(lastChange)
              }
              changeDistance(nextDistance)
            }}
          >
            {[...DISTANCE_OPTION_LIST, { value: 0, text: 'FREE' }].map(
              ({ value, text }) => (
                <SelectItem key={text} value={value}>
                  {text}
                </SelectItem>
              )
            )}
          </Select>
          <Knob
            disabled={distanceKnobDisabled}
            baseValue={distanceBase}
            value={distance}
            step={DISTANCE_KNOB_STEP}
            onBeforeRotateStart={() => {
              if (lock === 'distance' && lastChange !== 'distance') {
                setLock(lastChange)
              }
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
          <Select
            className={styles.select}
            label="PACE"
            selectedKeys={[
              PACE_OPTION_LIST.find((o) => o.value === pace)?.text ?? 'FREE',
            ]}
            disabledKeys={['FREE']}
            onSelectionChange={(keys) => {
              const [key] = Array.from(keys)
              const nextPace = PACE_OPTION_LIST.find(
                (o) => o.text === key
              )?.value
              if (!nextPace) return
              if (lock === 'pace' && lastChange !== 'pace') {
                setLock(lastChange)
              }
              changePace(nextPace)
            }}
          >
            {[...PACE_OPTION_LIST, { value: 0, text: 'FREE' }].map(
              ({ value, text }) => (
                <SelectItem key={text} value={value}>
                  {text}
                </SelectItem>
              )
            )}
          </Select>
          <Knob
            disabled={paceKnobDisabled}
            baseValue={paceBase}
            value={pace}
            step={PACE_KNOB_STEP}
            onBeforeRotateStart={() => {
              if (lock === 'pace' && lastChange !== 'pace') {
                setLock(lastChange)
              }
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
          <Select
            className={styles.select}
            label="TIME"
            selectedKeys={[
              TIME_OPTION_LIST.find((o) => o.value === time)?.text ?? 'FREE',
            ]}
            disabledKeys={['TIME']}
            onSelectionChange={(keys) => {
              const [key] = Array.from(keys)
              const nextTime = TIME_OPTION_LIST.find(
                (o) => o.text === key
              )?.value
              if (!nextTime) return
              if (lock === 'time' && lastChange !== 'time') {
                setLock(lastChange)
              }
              changeTime(nextTime)
            }}
          >
            {[...TIME_OPTION_LIST, { value: 0, text: 'FREE' }].map(
              ({ value, text }) => (
                <SelectItem key={text} value={value}>
                  {text}
                </SelectItem>
              )
            )}
          </Select>

          <Knob
            disabled={timeKnobDisabled}
            baseValue={timeBase}
            value={time}
            step={TIME_KNOB_STEP}
            onBeforeRotateStart={() => {
              if (lock === 'time' && lastChange !== 'time') {
                setLock(lastChange)
              }
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
    </div>
  )
}

export default Watch
