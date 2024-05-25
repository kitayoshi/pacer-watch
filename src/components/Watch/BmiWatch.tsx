'use client'

import { useCallback, useMemo, useState } from 'react'

import { Card } from '@nextui-org/card'
import cx from 'classnames'

import DigiNumber from '@/components/DigiNumber'
import Knob from '@/components/Knob'
import { Changer, History } from '@/utils/type'

import { LockButton } from './EditButton'

import {
  DEFAULT_HEIGHT,
  DEFAULT_WEIGHT,
  DEFAULT_HEIGHT_BASE,
  DEFAULT_WEIGHT_BASE,
  HEIGHT_KNOB_STEP,
  BMI_KNOB_STEP,
  WEIGHT_KNOB_STEP,
  HEIGHT_OPTION_LIST,
  BMI_OPTION_LIST,
  WEIGHT_OPTION_LIST,
  HeightWeight,
  getBmi,
  getWeight,
  getHeight,
} from './bmiUtils'

import SelectModal from './SelectModal'
import SelectNumber from './SelectNumber'

import styles from './Watch.module.css'

type NumberChanger = Changer<number>

type Lock = 'height' | 'bmi' | 'weight'
type LockHistory = History<Lock>

type BmiWatchProps = {
  className?: string
}

function BmiWatch(props: BmiWatchProps) {
  const { className } = props

  // base value
  const [heightBase, setHeightBase] = useState(DEFAULT_HEIGHT_BASE)
  const [weightBase, setTimeBase] = useState(DEFAULT_WEIGHT_BASE)
  const bmiBase = useMemo(
    () => getBmi(heightBase, weightBase),
    [heightBase, weightBase]
  )

  // lock
  const [lockHistory, setLockHistory] = useState<LockHistory>({
    current: 'height',
    last: 'weight',
  })
  const lock = lockHistory.current
  const setLock = useCallback((nextLock: Lock) => {
    setLockHistory((lockHistory) => {
      if (lockHistory.current === nextLock) return lockHistory
      return { current: nextLock, last: lockHistory.current }
    })
  }, [])
  const unlock = useCallback((changing: Lock) => {
    setLockHistory((lockHistory) => {
      if (lockHistory.current !== changing) return lockHistory
      return { current: lockHistory.last, last: lockHistory.current }
    })
  }, [])

  // utilitiy
  const [heightWeight, setHeightWeight] = useState<[number, number]>([
    DEFAULT_HEIGHT,
    DEFAULT_WEIGHT,
  ])
  const [height, weight] = heightWeight
  const bmi = useMemo(() => getBmi(height, weight), [height, weight])

  const changeHeight = useCallback(
    (heightChanger: NumberChanger) => {
      setHeightWeight(([currentHeight, currentWeight]) => {
        const nextHeight =
          typeof heightChanger === 'function'
            ? heightChanger(currentHeight)
            : heightChanger

        if (lock === 'bmi') {
          const currentBmi = getBmi(currentHeight, currentWeight)
          const nextWeight = getWeight(currentBmi, nextHeight)
          return [nextHeight, nextWeight]
        }

        return [nextHeight, currentWeight]
      })
    },
    [lock, setHeightWeight]
  )
  const changeWeight = useCallback(
    (weightChanger: NumberChanger) => {
      setHeightWeight(([currentHeight, currentWeight]) => {
        const nextWeight =
          typeof weightChanger === 'function'
            ? weightChanger(currentWeight)
            : weightChanger
        if (lock === 'bmi') {
          const currentBmi = getBmi(currentHeight, currentWeight)
          const nextHeight = getHeight(currentBmi, nextWeight)
          return [nextHeight, nextWeight]
        }
        return [currentHeight, nextWeight]
      })
    },
    [lock, setHeightWeight]
  )
  const changeBmi = useCallback(
    (bmiChanger: NumberChanger) => {
      setHeightWeight(([currentHeight, currentWeight]) => {
        const currentBmi = getBmi(currentHeight, currentWeight)
        const nextBmi =
          typeof bmiChanger === 'function' ? bmiChanger(currentBmi) : bmiChanger

        if (lock === 'bmi') {
          return [currentHeight, currentWeight]
        }

        if (lock === 'height') {
          const nextWeight = getWeight(nextBmi, currentHeight)
          return [currentHeight, nextWeight]
        }

        if (lock === 'weight') {
          const nextHeight = getHeight(nextBmi, currentWeight)
          return [nextHeight, currentWeight]
        }

        return [currentHeight, currentWeight]
      })
      return
    },
    [lock, setHeightWeight]
  )

  // height
  const [rotateHeight, setRotateHeight] = useState<number | null>(null)
  const [showHeightModal, setShowHeightModal] = useState(false)
  const [heightModalSelected, setHeightModalSelected] = useState(false)
  const onHeightRotateStart = useCallback(() => {
    setShowHeightModal(true)
  }, [])
  const onHeightRotateEnd = useCallback(() => {
    changeHeight((height) => Math.floor(height))
    setRotateHeight(null)
    setShowHeightModal(false)
    setHeightModalSelected(false)
  }, [changeHeight])
  const onHeightRotate = useCallback(
    (nextHeight: number, disabled: boolean) => {
      if (!disabled) changeHeight(nextHeight)
      setRotateHeight(nextHeight)
    },
    [changeHeight]
  )
  const onDisntanceModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setHeightModalSelected(false)
        return
      }
      setHeightModalSelected(true)
      changeHeight(value)
    },
    [changeHeight]
  )
  const heightKnobDisabled = useMemo(
    () => lock === 'height' || heightModalSelected,
    [lock, heightModalSelected]
  )

  // bmi
  const [rotateBmi, setRotateBmi] = useState<number | null>(null)
  const [showBmiModal, setShowBmiModal] = useState(false)
  const [bmiModalSelected, setBmiModalSelected] = useState(false)
  const onBmiRotateStart = useCallback(() => {
    setShowBmiModal(true)
  }, [])
  const onBmiRotateEnd = useCallback(() => {
    changeBmi((bmi) => Math.floor(bmi * 1000) / 1000)
    setRotateBmi(null)
    setShowBmiModal(false)
    setBmiModalSelected(false)
  }, [changeBmi])
  const onBmiRotate = useCallback(
    (nextBmi: number, disabled: boolean) => {
      if (!disabled) changeBmi(nextBmi)
      setRotateBmi(nextBmi)
    },
    [changeBmi]
  )
  const onBmiModalChange = useCallback(
    async (value: number | null) => {
      if (value === null) {
        setBmiModalSelected(false)
        return
      }
      setBmiModalSelected(true)
      changeBmi(value)
    },
    [changeBmi]
  )
  const bmiKnobDisabled = useMemo(
    () => lock === 'bmi' || bmiModalSelected,
    [lock, bmiModalSelected]
  )

  // weight
  const [rotateWeight, setRotateWeight] = useState<number | null>(null)
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [weightModalSelected, setWeightModalSelected] = useState(false)
  const onWeightRotateStart = useCallback(() => {
    setShowWeightModal(true)
  }, [])
  const onWeightRotateEnd = useCallback(() => {
    changeWeight((weight) => Math.floor(weight))
    setRotateWeight(null)
    setShowWeightModal(false)
    setWeightModalSelected(false)
  }, [changeWeight])
  const onWeightRotate = useCallback(
    (nextWeight: number, disabled: boolean) => {
      if (!disabled) changeWeight(nextWeight)
      setRotateWeight(nextWeight)
    },
    [changeWeight]
  )
  const onWeightModalChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        setWeightModalSelected(false)
        return
      }
      setWeightModalSelected(true)
      changeWeight(value)
    },
    [changeWeight]
  )
  const weightKnobDisabled = useMemo(
    () => lock === 'weight' || weightModalSelected,
    [lock, weightModalSelected]
  )

  return (
    <Card className={cx(styles.container, className)}>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>BMI</div>
      </div>

      <div className={styles.numberArea}>
        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="HEIGHT"
            value={height}
            optionList={HEIGHT_OPTION_LIST}
            onChange={(nextHeight) => {
              unlock('height')
              changeHeight(nextHeight)
            }}
          />
          <DigiNumber
            className={styles.number}
            label="HEIGHT"
            numberText={`${Math.floor(height)}cm`}
            subNumberText={`${(Math.floor(height) / 100).toFixed(2)}m`}
          />
        </div>

        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="WEIGHT"
            value={weight}
            optionList={WEIGHT_OPTION_LIST}
            onChange={(nextWeight) => {
              unlock('weight')
              changeWeight(nextWeight)
            }}
          />
          <DigiNumber
            className={styles.number}
            label="HEIGHT"
            numberText={`${(weight / 1000).toFixed(1)}kg`}
            subNumberText={`${(weight / 1000).toFixed(2)}kg`}
          />
        </div>

        <div className={styles.numberItem}>
          <SelectNumber
            className={styles.numberSelect}
            label="BMI"
            value={bmi}
            optionList={BMI_OPTION_LIST}
            onChange={(nextBmi) => {
              unlock('bmi')
              changeBmi(nextBmi)
            }}
          />
          <DigiNumber
            className={styles.number}
            label="BMI"
            numberText={bmi.toFixed(1)}
            subNumberText={bmi.toFixed(2)}
          />
        </div>
      </div>

      <div className={styles.buttonArea}>
        <div className={styles.buttonContainer}>
          <Knob
            disabled={heightKnobDisabled}
            baseValue={heightBase}
            value={height}
            step={HEIGHT_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('height')
            }}
            onRotate={onHeightRotate}
            onRotateStart={onHeightRotateStart}
            onRotateEnd={onHeightRotateEnd}
          />
          <LockButton
            className={styles.lockButton}
            locked={lock === 'height'}
            onClick={() => {
              setLock('height')
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Knob
            disabled={weightKnobDisabled}
            baseValue={weightBase}
            value={weight}
            step={WEIGHT_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('weight')
            }}
            onRotate={onWeightRotate}
            onRotateStart={onWeightRotateStart}
            onRotateEnd={onWeightRotateEnd}
          />

          <LockButton
            className={styles.lockButton}
            locked={lock === 'weight'}
            onClick={() => {
              setLock('weight')
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Knob
            disabled={bmiKnobDisabled}
            baseValue={bmiBase}
            value={bmi}
            step={BMI_KNOB_STEP}
            onBeforeRotateStart={() => {
              unlock('bmi')
            }}
            onRotate={onBmiRotate}
            onRotateStart={onBmiRotateStart}
            onRotateEnd={onBmiRotateEnd}
          />
          <LockButton
            className={styles.lockButton}
            locked={lock === 'bmi'}
            onClick={() => {
              setLock('bmi')
            }}
          />
        </div>
      </div>

      <SelectModal
        label="HEIGHT"
        nearValue={rotateHeight}
        optionList={HEIGHT_OPTION_LIST}
        isOpen={showHeightModal}
        onSelect={onDisntanceModalChange}
      />

      <SelectModal
        label="BMI"
        nearValue={rotateBmi}
        optionList={BMI_OPTION_LIST}
        isOpen={showBmiModal}
        onSelect={onBmiModalChange}
      />

      <SelectModal
        label="WEIGHT"
        nearValue={rotateWeight}
        optionList={WEIGHT_OPTION_LIST}
        isOpen={showWeightModal}
        onSelect={onWeightModalChange}
      />
    </Card>
  )
}

export default BmiWatch
