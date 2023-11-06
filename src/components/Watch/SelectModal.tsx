import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/modal'
import { Button, ButtonProps } from '@nextui-org/button'
import { ScrollShadow } from '@nextui-org/scroll-shadow'

import { Point } from '@/utils/angle'

import styles from './SelectModal.module.css'

type HoverButtonProps = {
  value: number
  hoveringPoint: Point | null
  onEnter: (value: number) => void
  onLeave: (value: number) => void
}

function HoverButton(props: ButtonProps & HoverButtonProps) {
  const { value, hoveringPoint, onEnter, onLeave, ...buttonProps } = props

  const buttonElementRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!buttonElementRef.current) return
    if (!hoveringPoint) return

    const buttonRect = buttonElementRef.current.getBoundingClientRect()
    if (
      hoveringPoint[0] >= buttonRect.left &&
      hoveringPoint[0] <= buttonRect.right &&
      hoveringPoint[1] >= buttonRect.top &&
      hoveringPoint[1] <= buttonRect.bottom
    ) {
      onEnter(value)
    } else {
      onLeave(value)
    }
  }, [hoveringPoint, value, onEnter, onLeave])

  return <Button size="sm" ref={buttonElementRef} {...buttonProps} />
}

type SelectModalProps = {
  label: string
  nearValue?: number | null
  optionList: { value: number; text: string }[]
  isOpen: boolean
  onSelect: (value: number | null) => void
}

function SelectModal(props: SelectModalProps) {
  const { label, optionList, isOpen, onSelect, nearValue } = props

  const [currentPoint, setCurrentPoint] = useState<Point | null>(null)
  const [currentValue, setCurrentValue] = useState<number | null>(null)

  const onPointerMove = useCallback((e: PointerEvent) => {
    setCurrentPoint([e.clientX, e.clientY])
  }, [])

  const onHoverButtonEnter = useCallback((value: number) => {
    setCurrentValue(value)
  }, [])
  const onHoverButtonLeave = useCallback((leavingValue: number) => {
    setCurrentValue((currentValue) => {
      if (currentValue === leavingValue) return null
      return currentValue
    })
  }, [])

  useEffect(() => {
    onSelect(currentValue)
  }, [currentValue, onSelect])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('pointermove', onPointerMove)
    } else {
      document.removeEventListener('pointermove', onPointerMove)
      setCurrentPoint(null)
    }
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
    }
  }, [isOpen, onPointerMove])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const setScrollContainerScrollLeft = useCallback(
    (value: number) => {
      if (!scrollContainerRef.current) return
      const minValue = optionList[0].value
      const maxValue = optionList[optionList.length - 1].value
      const scrollPercent = (value - minValue) / (maxValue - minValue)
      const scrollContainerWidth = scrollContainerRef.current.clientWidth
      const scrollWidth = scrollContainerRef.current.scrollWidth
      const scrollLeft = scrollWidth * scrollPercent - scrollContainerWidth / 2
      scrollContainerRef.current.scrollLeft = scrollLeft
    },
    [scrollContainerRef, optionList]
  )
  useEffect(() => {
    if (!nearValue) return
    setScrollContainerScrollLeft(nearValue)
  }, [nearValue, setScrollContainerScrollLeft])

  return (
    <Modal
      className={styles.modal}
      placement="bottom"
      isOpen={isOpen}
      backdrop="transparent"
    >
      <ModalContent>
        <ModalHeader>{label}</ModalHeader>
        <ModalBody>
          <ScrollShadow orientation="horizontal" ref={scrollContainerRef}>
            <div className={styles.modalButtonList}>
              {optionList.map(({ value, text }) => {
                return (
                  <HoverButton
                    key={value}
                    value={value}
                    hoveringPoint={currentPoint}
                    onEnter={onHoverButtonEnter}
                    onLeave={onHoverButtonLeave}
                  >
                    {text}
                  </HoverButton>
                )
              })}
            </div>
          </ScrollShadow>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SelectModal
