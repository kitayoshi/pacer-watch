import {
  MouseEventHandler,
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import cx from 'classnames'

import { Point, getPointAngle } from '@/utils/angle'

import styles from './Knob.module.css'

type KnobProps = {
  className?: string
  step?: number
  baseValue?: number
  min?: number
  max?: number
  value: number
  onBeforeRotateStart?: () => void
  onRotate: (value: number, disabled: boolean) => void
  onRotateStart?: () => void
  onRotateEnd?: () => void
  disabled?: boolean
}

function Knob(props: KnobProps) {
  const {
    className,
    step = 1,
    baseValue = 0,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    value,
    onBeforeRotateStart,
    onRotate,
    onRotateStart,
    onRotateEnd,
    disabled,
  } = props

  const period = (value - baseValue) / step

  const [moving, setMoving] = useState(false)

  const currentAngleRef = useRef(0)
  const currentDeltaRef = useRef<number | null>(null)
  const closewiseCount = useRef(0)

  const buttonElementRef = useRef<HTMLButtonElement>(null)
  const buttonPointRef = useRef<Point | null>(null)
  const startPointRef = useRef<Point | null>(null)
  const currentPointRef = useRef<Point | null>(null)

  const disabledRef = useRef(disabled)
  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!buttonPointRef.current) return
      if (!startPointRef.current) {
        startPointRef.current = [e.clientX, e.clientY]
      }
      currentPointRef.current = [e.clientX, e.clientY]

      const startAngle = getPointAngle(
        buttonPointRef.current,
        startPointRef.current
      )
      const currentAngle = getPointAngle(
        buttonPointRef.current,
        currentPointRef.current
      )

      // normalize delta
      let nextDelta = currentAngle - startAngle

      if (nextDelta < 0) nextDelta += 360

      if (currentDeltaRef.current !== null) {
        // closewise thershold
        if (nextDelta < 5 && currentDeltaRef.current > 355) {
          closewiseCount.current += 1
        }
        if (nextDelta > 355 && currentDeltaRef.current < 5) {
          closewiseCount.current -= 1
        }
      }

      currentDeltaRef.current = nextDelta

      const nextAngle =
        currentAngleRef.current +
        currentDeltaRef.current +
        closewiseCount.current * 360

      const nextPeriod = nextAngle / 360
      const nextValue = baseValue + nextPeriod * step

      if (min !== undefined && nextValue <= min) {
        onRotate(min, disabledRef.current)
        return
      }
      if (max !== undefined && nextValue > max) {
        onRotate(max, disabledRef.current)
        return
      }

      onRotate(nextValue, disabledRef.current)
    },
    [min, max, onRotate, baseValue, step]
  )

  const onPointerUp = useCallback(() => {
    onRotateEnd?.()
    setMoving(false)

    startPointRef.current = null
    currentPointRef.current = null

    currentAngleRef.current =
      currentAngleRef.current + (currentDeltaRef.current || 0)
    currentDeltaRef.current = null
    closewiseCount.current = 0

    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove, onRotateEnd])

  const onPointerDown = useCallback<
    PointerEventHandler<HTMLButtonElement>
  >(() => {
    if (disabled) return
    onRotateStart?.()

    setMoving(true)

    startPointRef.current = null
    currentPointRef.current = null
    closewiseCount.current = 0
    currentAngleRef.current = period * 360

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }, [disabled, onRotateStart, period, onPointerMove, onPointerUp])

  const resetButtonRect = useCallback(() => {
    const buttonRect = buttonElementRef.current?.getBoundingClientRect()
    if (!buttonRect) return
    buttonPointRef.current = [
      buttonRect.left + buttonRect.width / 2,
      buttonRect.top + buttonRect.height / 2,
    ]
  }, [])

  useEffect(() => {
    resetButtonRect()
    window.addEventListener('resize', resetButtonRect)
    return () => {
      window.removeEventListener('resize', resetButtonRect)
    }
  }, [resetButtonRect])

  const rotateAngle = (period * 360) % 360

  return (
    <div className={cx(styles.container, className)}>
      <button
        className={cx(styles.button, { [styles.buttonMoving]: moving })}
        onPointerDownCapture={onBeforeRotateStart}
        onPointerDown={onPointerDown}
        ref={buttonElementRef}
        style={{ transform: `rotate(${rotateAngle}deg)` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className={styles.buttonDot} />
      </button>
    </div>
  )
}

export default Knob
