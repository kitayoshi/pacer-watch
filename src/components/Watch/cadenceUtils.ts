export const DEFAULT_CADENCE = 190
export const DEFAULT_CADENCE_BASE = 190

export const DEFAULT_STRIDE = 120 // cm
export const DEFAULT_STRIDE_BASE = 120

export type CadenceStride = [number, number]

export const CADENCE_OPTION_LIST = [
  { value: 180, text: '180spm' },
  { value: 185, text: '185spm' },
  { value: 190, text: '190spm' },
  { value: 195, text: '195spm' },
  { value: 200, text: '200spm' },
  { value: 205, text: '205spm' },
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

export const STRIDE_OPTION_LIST = [
  { value: 100, text: '1.00m' },
  { value: 105, text: '1.05m' },
  { value: 110, text: '1.10m' },
  { value: 115, text: '1.15m' },
  { value: 120, text: '1.20m' },
  { value: 125, text: '1.25m' },
]

export const CADENCE_KNOB_STEP = 10
export const PACE_KNOB_STEP = 60 / 1000
export const STRIDE_KNOB_STEP = 10

export function getPace(cadence: number, stride: number): number {
  const pace = (1 / ((cadence * stride) / 100)) * 60
  return pace
}

export function getCadence(pace: number, stride: number): number {
  const cadence = ((1 / (pace / 60)) * 100) / stride
  return cadence
}

export function getStride(pace: number, cadence: number): number {
  const stride = ((1 / (pace / 60)) * 100) / cadence
  return stride
}
