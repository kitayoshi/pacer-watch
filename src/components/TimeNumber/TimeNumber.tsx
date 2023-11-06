import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'
import { padTime } from '@/utils/time'

type TimeNumberProps = {
  className?: string
  time: number // second
}

function TimeNumber(props: TimeNumberProps) {
  const { className, time } = props

  const hour = time / 3600
  const minute = (time % 3600) / 60
  const second = time % 60
  const millisecond = (time % 1) * 1000

  const hourString = String(Math.floor(hour))
  const minuteString = String(Math.floor(minute)).padStart(2, '0')
  const secondString = String(Math.floor(second)).padStart(2, '0')
  const millisecondString = String(Math.floor(millisecond)).padStart(3, '0')

  const numberText = `${hourString}:${minuteString}:${secondString}`
  const subNumberText = `${hourString}:${minuteString}:${secondString}.${millisecondString}`

  return (
    <DigiNumber
      className={cx(className)}
      label="TIME"
      numberText={numberText}
      subNumberText={subNumberText}
    />
  )
}

export default TimeNumber
