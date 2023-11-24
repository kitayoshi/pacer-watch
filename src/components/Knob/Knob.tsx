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
    min = 0.001,
    max = Number.MAX_SAFE_INTEGER,
    value,
    onBeforeRotateStart,
    onRotate,
    onRotateStart,
    onRotateEnd,
    disabled = false,
  } = props

  const period = (value - baseValue) / step

  const [moving, setMoving] = useState(false)

  const currentAngleRef = useRef(0)
  const currentDeltaRef = useRef<number | null>(null)
  const closewiseCount = useRef(0)

  const elementRef = useRef<HTMLButtonElement>(null)
  const buttonPointRef = useRef<Point | null>(null)
  const startPointRef = useRef<Point | null>(null)
  const currentPointRef = useRef<Point | null>(null)

  const onPointerMove = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (e) => {
      if (!moving) return
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
        if (currentDeltaRef.current - nextDelta > 270) {
          closewiseCount.current += 1
        }
        if (nextDelta - currentDeltaRef.current > 270) {
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
        onRotate(min, disabled)
        return
      }
      if (max !== undefined && nextValue > max) {
        onRotate(max, disabled)
        return
      }

      onRotate(nextValue, disabled)
    },
    [min, max, onRotate, disabled, baseValue, step, moving]
  )

  const onPointerUp = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (e) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      onRotateEnd?.()
      setMoving(false)

      startPointRef.current = null
      currentPointRef.current = null

      currentAngleRef.current =
        currentAngleRef.current + (currentDeltaRef.current || 0)
      currentDeltaRef.current = null
      closewiseCount.current = 0
    },
    [onRotateEnd]
  )

  const onPointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (e) => {
      if (disabled) return

      const buttonRect = elementRef.current?.getBoundingClientRect()
      if (!buttonRect) return
      buttonPointRef.current = [
        buttonRect.x + buttonRect.width / 2,
        buttonRect.y + buttonRect.height / 2,
      ]

      e.currentTarget.setPointerCapture(e.pointerId)
      onRotateStart?.()
      setMoving(true)

      startPointRef.current = null
      currentPointRef.current = null
      closewiseCount.current = 0
      currentAngleRef.current = period * 360
    },
    [disabled, onRotateStart, period]
  )

  const rotateAngle = (period * 360) % 360

  return (
    <div className={cx(styles.container, className)}>
      <button
        className={cx(styles.button, 'border-default', 'border-small', {
          [styles.buttonMoving]: moving,
        })}
        data-pressed={moving}
        onPointerDownCapture={onBeforeRotateStart}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={elementRef}
        style={{
          transform: `rotate(${rotateAngle}deg) scale(${moving ? 0.97 : 1})`,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className={cx(
            styles.buttonDot,
            'bg-default',
            'border-default',
            'border-medium',
            'rounded-full'
          )}
        />
      </button>
    </div>
  )
}

export default Knob
