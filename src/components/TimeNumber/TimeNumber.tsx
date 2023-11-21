import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'
import { formatHHMMSS, formatHHMMSSsss } from '@/utils/time'

type TimeNumberProps = {
  className?: string
  time: number // second
}

function TimeNumber(props: TimeNumberProps) {
  const { className, time } = props

  const numberText = formatHHMMSS(time)
  const subNumberText = formatHHMMSSsss(time)

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
