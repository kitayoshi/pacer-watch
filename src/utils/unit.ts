import { formatHHMMSS } from './time'

export function formatDistance(distance: number) {
  const unit = distance < 1000 ? 'm' : 'km'
  const kmDistanceString = (distance / 1000).toFixed(1)
  const displayDistance =
    distance < 1000 ? Math.floor(distance) : `${kmDistanceString}`
  const numberText = `${displayDistance}${unit}`
  return numberText
}

export function formatPace(inputPace: number) {
  const pace = inputPace * 1000

  const minute = pace / 60
  const second = pace % 60

  const minuteString = String(Math.floor(minute))
  const secondString = String(Math.floor(second)).padStart(2, '0')

  const numberText = `${minuteString}:${secondString}/km`
  return numberText
}

export function formatTime(time: number) {
  const numberText = formatHHMMSS(time)
  return numberText
}
