import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'

type StrideNumberProps = {
  className?: string
  stride: number // cm
}

function StrideNumber(props: StrideNumberProps) {
  const { className, stride } = props

  const numberText = `${(stride / 100).toFixed(2)}m`
  const subNumberText = `${stride.toFixed(2)}cm`

  return (
    <DigiNumber
      className={cx(className)}
      label="STRIDE"
      numberText={numberText}
      subNumberText={subNumberText}
    />
  )
}

export default StrideNumber
