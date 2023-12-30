type Second = number

export function padTime(time: Second) {
  return String(time).padStart(2, '0')
}

export function formatHHMMSS(time: Second) {
  const hour = time / 3600
  const minute = (time % 3600) / 60
  const second = time % 60

  const hourString = String(Math.floor(hour))
  const minuteString = String(Math.floor(minute)).padStart(2, '0')
  const secondString = String(Math.floor(second)).padStart(2, '0')

  const numberText = `${hourString}:${minuteString}:${secondString}`

  return numberText
}

export function formatHHMMSSsss(time: Second) {
  const hour = time / 3600
  const minute = (time % 3600) / 60
  const second = time % 60
  const millisecond = (time % 1) * 1000

  const hourString = String(Math.floor(hour))
  const minuteString = String(Math.floor(minute)).padStart(2, '0')
  const secondString = String(Math.floor(second)).padStart(2, '0')
  const millisecondString = String(Math.floor(millisecond)).padStart(3, '0')

  const numberText = `${hourString}:${minuteString}:${secondString}.${millisecondString}`
  return numberText
}

export function getYearList(startYear: number, length: number) {
  return Array.from({ length }, (_, i) => i + startYear - length + 1).reverse()
}
