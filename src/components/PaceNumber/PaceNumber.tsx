import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'

type PaceNumberProps = {
  className?: string
  pace: number // second per m
}

function PaceNumber(props: PaceNumberProps) {
  const { className, pace: propsPace } = props

  const pace = propsPace * 1000

  const minute = pace / 60
  const second = pace % 60
  const millisecond = (pace % 1) * 1000

  const minuteString = String(Math.floor(minute))
  const secondString = String(Math.floor(second)).padStart(2, '0')
  const millisecondString = String(Math.floor(millisecond)).padStart(3, '0')

  const numberText = `${minuteString}:${secondString}/km`
  const subNumberText = `${minuteString}:${secondString}.${millisecondString}/km`

  return (
    <DigiNumber
      className={cx(className)}
      label="PACE"
      numberText={numberText}
      subNumberText={subNumberText}
    />
  )
}

export default PaceNumber
