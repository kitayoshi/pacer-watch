import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'

type CadenceNumberProps = {
  className?: string
  cadence: number // step per minute
}

function CadenceNumber(props: CadenceNumberProps) {
  const { className, cadence } = props

  const numberText = `${Math.round(cadence)}spm`
  const subNumberText = `${cadence.toFixed(2)}spm`

  return (
    <DigiNumber
      className={cx(className)}
      label="CADENCE"
      numberText={numberText}
      subNumberText={subNumberText}
    />
  )
}

export default CadenceNumber
