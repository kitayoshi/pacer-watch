'use client'

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'

import { Card } from '@nextui-org/card'
import { Button } from '@nextui-org/button'

import cx from 'classnames'
import { Lato } from 'next/font/google'

import PaceNumber from '@/components/PaceNumber'
import CadenceNumber from '@/components/CadenceNumber'
import StrideNumber from '@/components/StrideNumber'
import Knob from '@/components/Knob'
import { Changer, History } from '@/utils/type'

import { LockButton } from './EditButton'

import {
  DEFAULT_CADENCE_BASE,
  DEFAULT_STRIDE_BASE,
  CADENCE_KNOB_STEP,
  PACE_KNOB_STEP,
  STRIDE_KNOB_STEP,
  CADENCE_OPTION_LIST,
  PACE_OPTION_LIST,
  STRIDE_OPTION_LIST,
  CadenceStride,
  getPace,
  getStride,
  getCadence,
} from './cadenceUtils'

import SelectModal from './SelectModal'
import SelectNumber from './SelectNumber'

import styles from './Watch.module.css'

type NumberChanger = Changer<number>
type NumberListChanger = Changer<[number, number]>

type Lock = 'cadence' | 'pace' | 'stride'
type LockHistory = History<Lock>
type LockHistoryChanger = Changer<LockHistory>

type CadenceWatchProps = {
  className?: string
  cadenceStride: CadenceStride
  setCadenceStride: (changer: NumberListChanger) => void
  lock: Lock
  setLock: (nextLock: Lock) => void
  unlock: (changing: Lock) => void
}

function CadenceWatch(props: CadenceWatchProps) {
  const { className, cadenceStride, setCadenceStride, lock, setLock, unlock } =
    props

  // base value
  const [cadenceBase, setCadenceBase] = useState(DEFAULT_CADENCE_BASE)
  const [strideBase, setTimeBase] = useState(DEFAULT_STRIDE_BASE)
  const paceBase = useMemo(
    () => getPace(cadenceBase, strideBase),
    [cadenceBase, strideBase]
  )

  // utilitiy
  const [cadence, stride] = cadenceStride
  const pace = useMemo(() => getPace(cadence, stride), [cadence, stride])

  const changeCadence = useCallback(
    (cadenceChanger: NumberChanger) => {
      setCadenceStride(([currentCadence, currentStride]) => {
        const nextCadence =
          typeof cadenceChanger === 'function'
            ? cadenceChanger(currentCadence)
            : cadenceChanger

        if (lock === 'pace') {
          const currentPace = getPace(currentCadence, currentStride)
          const nextStride = getStride(currentPace, nextCadence)
          return [nextCadence, nextStride]
        }

        return [nextCadence, currentStride]
      })
    },
    [lock, setCadenceStride]
  )
  const changeStride = useCallback(
    (strideChanger: NumberChanger) => {
      setCadenceStride(([currentCadence, currentStride]) => {
        const nextStride =
          typeof strideChanger === 'function'
            ? strideChanger(currentStride)
            : strideChanger
        if (lock === 'pace') {
          const currentPace = getPace(currentCadence, currentStride)
          const nextCadence = getCadence(currentPace, nextStride)
          return [nextCadence, nextStride]
        }
        return [currentCadence, nextStride]
      })
    },
    [lock, setCadenceStride]
  )
  const changePace = useCallback(
    (paceChanger: NumberChanger) => {
      setCadenceStride(([currentCadence, currentStride]) => {
        const currentPace = getPace(currentCadence, currentStride)
        const nextPace =
          typeof paceChanger === 'function'
            ? paceChanger(currentPace)
            : paceChanger

        if (lock === 'pace') {
          return [currentCadence, currentStride]
        }

        if (lock === 'cadence') {
          const nextStride = getStride(nextPace, currentCadence)
          return [currentCadence, nextStride]
        }

        if (lock === 'stride') {
          const nextCadence = getCadence(nextPace, currentStride)
          return [nextCadence, currentStride]
        }

        return [currentCadence, currentStride]
      })
      return
    },
    [lock, setCadenceStride]
  )

  // cadence
  const [rotateCadence, setRotateCadence] = useState<number | null>(null)
  const [showCadenceModal, setShowCadenceModal] = useState(false)
  const [cadenceModalSelected, setCadenceModalSelected] = useState(false)
  const onCadenceRotateStart = useCallback(() => {
    setShowCadenceModal(true)
  }, [])
  const onCadenceRotateEnd = useCallback(() => {
    changeCadence((cadence) => Math.floor(cadence))
    setRotateCadence(null)
    setShowCadenceModal(false)
    setCadenceModalSelected(false)
  }, [changeCadence])
  const onCadenceRotate = useCallback(
    (nextCadence: number, disabled: boolean) => {
      if (!disabled) changeCadence(nextCadence)
      setRotateCadence(nextCadence)
    },
    [changeCadence]
  )
  const onCadenceModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setCadenceModalSelected(false)
        return
      }
      setCadenceModalSelected(true)
      changeCadence(value)
    },
    [changeCadence]
  )
  const cadenceKnobDisabled = useMemo(
    () => lock === 'cadence' || cadenceModalSelected,
    [lock, cadenceModalSelected]
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

  // stride
  const [rotateStride, setRotateStride] = useState<number | null>(null)
  const [showStrideModal, setShowStrideModal] = useState(false)
  const [strideModalSelected, setStrideModalSelected] = useState(false)
  const onStrideRotateStart = useCallback(() => {
    setShowStrideModal(true)
  }, [])
  const onStrideRotateEnd = useCallback(() => {
    changeStride((stride) => Math.floor(stride))
    setRotateStride(null)
    setShowStrideModal(false)
    setStrideModalSelected(false)
  }, [changeStride])
  const onStrideRotate = useCallback(
    (nextStride: number, disabled: boolean) => {
      if (!disabled) changeStride(nextStride)
      setRotateStride(nextStride)
    },
    [changeStride]
  )
  const onStrideModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setStrideModalSelected(false)
        return
      }
      setStrideModalSelected(true)
      changeStride(value)
    },
    [changeStride]
  )
  const strideKnobDisabled = useMemo(
    () => lock === 'stride' || strideModalSelected,
    [lock, strideModalSelected]
  )

  return (
    <Card className={cx(styles.container, className)}>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>CADENCE / STRIDE</div>
      </div>

      <div className={styles.numberArea}>
        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="CADENCE"
            value={cadence}
            optionList={CADENCE_OPTION_LIST}
            onChange={(nextCadence) => {
              unlock('cadence')
              changeCadence(nextCadence)
            }}
          />
          <CadenceNumber className={styles.number} cadence={cadence} />
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
            label="STRIDE"
            value={stride}
            optionList={STRIDE_OPTION_LIST}
            onChange={(nextStride) => {
              unlock('stride')
              changeStride(nextStride)
            }}
          />
          <StrideNumber className={styles.number} stride={stride} />
        </div>
      </div>

      <div className={styles.buttonArea}>
        <div className={styles.buttonContainer}>
          <Knob
            disabled={cadenceKnobDisabled}
            baseValue={cadenceBase}
            value={cadence}
            step={CADENCE_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('cadence')
            }}
            onRotate={onCadenceRotate}
            onRotateStart={onCadenceRotateStart}
            onRotateEnd={onCadenceRotateEnd}
          />
          <LockButton
            className={styles.lockButton}
            locked={lock === 'cadence'}
            onClick={() => {
              setLock('cadence')
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
          <LockButton
            className={styles.lockButton}
            locked={lock === 'pace'}
            onClick={() => {
              setLock('pace')
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Knob
            disabled={strideKnobDisabled}
            baseValue={strideBase}
            value={stride}
            step={STRIDE_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('stride')
            }}
            onRotate={onStrideRotate}
            onRotateStart={onStrideRotateStart}
            onRotateEnd={onStrideRotateEnd}
          />

          <LockButton
            className={styles.lockButton}
            locked={lock === 'stride'}
            onClick={() => {
              setLock('stride')
            }}
          />
        </div>
      </div>

      <SelectModal
        label="CADENCE"
        nearValue={rotateCadence}
        optionList={CADENCE_OPTION_LIST}
        isOpen={showCadenceModal}
        onSelect={onCadenceModalChange}
      />

      <SelectModal
        label="PACE"
        nearValue={rotatePace}
        optionList={PACE_OPTION_LIST}
        isOpen={showPaceModal}
        onSelect={onPaceModalChange}
      />

      <SelectModal
        label="STRIDE"
        nearValue={rotateStride}
        optionList={STRIDE_OPTION_LIST}
        isOpen={showStrideModal}
        onSelect={onStrideModalChange}
      />
    </Card>
  )
}

export default CadenceWatch
