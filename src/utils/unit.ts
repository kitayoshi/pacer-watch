export function formatDistance(distance: number) {
  const unit = distance < 1000 ? 'm' : 'km'
  const kmDistanceString = (distance / 1000).toFixed(1)
  const displayDistance =
    distance < 1000 ? Math.floor(distance) : `${kmDistanceString}`
  const numberText = `${displayDistance}${unit}`
  return numberText
}
