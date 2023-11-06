import cx from 'classnames'
import DigiNumber from '@/components/DigiNumber'

type DistanceNumberProps = {
  className?: string
  distance: number // meter
}

function DistanceNumber(props: DistanceNumberProps) {
  const { className, distance } = props

  const unit = distance < 1000 ? 'm' : 'km'

  let kmDistanceString = (distance / 1000).toFixed(1)
  if (distance === 42195) kmDistanceString = '42.195'
  if (distance === 21097.5) kmDistanceString = '21.0975'

  const displayDistance =
    distance < 1000 ? Math.floor(distance) : `${kmDistanceString}`
  const numberText = `${displayDistance}${unit}`

  const subNumberText = `${distance.toFixed(1)}m`

  return (
    <DigiNumber
      className={cx(className)}
      label="DISTANCE"
      numberText={numberText}
      subNumberText={subNumberText}
    />
  )
}

export default DistanceNumber
