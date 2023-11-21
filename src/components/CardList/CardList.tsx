'use client'

import cx from 'classnames'
import { useMemo, useState } from 'react'

import Watch from '@/components/Watch'
import LapTable from '@/components/LapTable'

import {
  DEFAULT_DISTANCE,
  DEFAULT_TIME,
  DistanceTime,
} from '@/components/Watch/utils'

import styles from './CardList.module.css'

type CardListProps = {
  className?: string
}

function CardList(props: CardListProps) {
  const { className } = props

  const [showLapTable, setShowLapTable] = useState(false)

  const [distanceTime, setDistanceTime] = useState<DistanceTime>([
    DEFAULT_DISTANCE,
    DEFAULT_TIME,
  ])

  // utilitiy
  const [distance, time] = distanceTime
  const pace = useMemo(() => time / distance, [distance, time])

  return (
    <div
      className={cx(
        styles.cardList,
        'sm:my-auto',
        'flex',
        'flex-col',
        'sm:flex-row',
        className
      )}
    >
      <Watch
        className={cx(styles.watch)}
        distanceTime={distanceTime}
        setDistanceTime={setDistanceTime}
        onLapButtonClick={() => setShowLapTable((current) => !current)}
      />
      {showLapTable && <LapTable pace={pace} />}
    </div>
  )
}

export default CardList
