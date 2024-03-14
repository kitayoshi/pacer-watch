export const DEFAULT_DISTANCE = 42195
export const DEFAULT_DISTANCE_BASE = 42195

export const DEFAULT_TIME = 10800
export const DEFAULT_TIME_BASE = 10800

export type DistanceTime = [number, number]

export const DISTANCE_OPTION_LIST = [
  { value: 400, text: '400m' },
  { value: 800, text: '800m' },
  { value: 1000, text: '1K' },
  { value: 5000, text: '5K' },
  { value: 10000, text: '10K' },
  { value: 15000, text: '15K' },
  { value: 20000, text: '20K' },
  { value: 21097.5, text: 'HALF' },
  { value: 30000, text: '30K' },
  { value: 42195, text: 'FULL' },
  { value: 50000, text: '50K' },
]

const PACE_MINUTE_LIST = [2, 3, 4, 5, 6, 7, 8]
const PACE_SECOND_LIST = [0, 15, 30, 45, 50]
export const PACE_OPTION_LIST = PACE_MINUTE_LIST.map((minute) => {
  return PACE_SECOND_LIST.map((second) => {
    const secondString = String(second).padStart(2, '0')
    return {
      value: (60 * minute + second) / 1000,
      text: `${minute}:${secondString}/km`,
    }
  })
})
  .flat()
  .filter((option) => {
    if (option.value < (60 * 2 + 30) / 1000) return false
    return true
  })

const TIME_HOUR_LIST = [0, 1, 2, 3, 4, 5, 6]
const TIME_MINUTE_LIST = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
export const TIME_OPTION_LIST = TIME_HOUR_LIST.map((hour) => {
  return TIME_MINUTE_LIST.map((minute) => {
    const minuteString = String(minute).padStart(2, '0')
    return {
      value: 60 * 60 * hour + 60 * minute,
      text: hour < 1 ? `${minuteString}m` : `${hour}h${minuteString}m`,
    }
  })
})
  .flat()
  .filter((option) => {
    if (option.value > 60 * 60 * 6 + 60 * 30) return false
    return true
  })

export const DISTANCE_KNOB_STEP = 1000 * 10
export const PACE_KNOB_STEP = 60 / 1000
export const TIME_KNOB_STEP = (60 * 60) / 2
