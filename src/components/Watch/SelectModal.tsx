import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/modal'
import { Button, ButtonProps } from '@nextui-org/button'
import { ScrollShadow } from '@nextui-org/scroll-shadow'

import { Point } from '@/utils/angle'

import styles from './SelectModal.module.css'

type HoverButtonProps = {
  value: number
}

function HoverButton(props: ButtonProps & HoverButtonProps) {
  const { value, ...buttonProps } = props

  const buttonElementRef = useRef<HTMLButtonElement>(null)

  return (
    <Button
      size="sm"
      data-option-value={value}
      ref={buttonElementRef}
      className={styles.button}
      {...buttonProps}
    />
  )
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

  const [currentValue, setCurrentValue] = useState<number | null>(null)

  const onPointerMove = useCallback((e: PointerEvent) => {
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
    if (!hoveredElement) return
    const value = (hoveredElement as HTMLElement).dataset.optionValue
    setCurrentValue(Number(value) || null)
  }, [])

  useEffect(() => {
    onSelect(currentValue)
  }, [currentValue, onSelect])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('pointermove', onPointerMove)
    } else {
      document.removeEventListener('pointermove', onPointerMove)
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
                  <HoverButton key={value} value={value}>
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
