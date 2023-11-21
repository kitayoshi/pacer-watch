'use client'

import cx from 'classnames'
import { Card } from '@nextui-org/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table'

import { LAW_ROW_LIST } from './utils'

import styles from './LapTable.module.css'
import { formatHHMMSS } from '@/utils/time'

type LapTableProps = {
  className?: string
  pace: number
}

function LapTable(props: LapTableProps) {
  const { className, pace } = props
  return (
    <Card className={cx(styles.container, className)}>
      <Table removeWrapper aria-label="Lap table" isStriped>
        <TableHeader>
          <TableColumn>DISTANCE</TableColumn>
          <TableColumn>TIME</TableColumn>
          <TableColumn>LAP</TableColumn>
        </TableHeader>
        <TableBody items={LAW_ROW_LIST}>
          {LAW_ROW_LIST.map((row) => {
            const showLapTime = row.showLapTime === false ? false : true
            const distance = row.value
            const time = pace * distance
            const lapDistance = 5000 // 5km
            const lapTime = pace * lapDistance

            const distanceText = row.text
            const timeText = formatHHMMSS(time)
            const lapTimeText = showLapTime ? formatHHMMSS(lapTime) : '-'

            return (
              <TableRow key={row.text}>
                <TableCell>{distanceText}</TableCell>
                <TableCell>{timeText}</TableCell>
                <TableCell>{lapTimeText}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

export default LapTable
