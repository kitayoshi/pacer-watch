export const DEFAULT_HEIGHT = 170 // cm
export const DEFAULT_HEIGHT_BASE = 170

export const DEFAULT_WEIGHT = 65000 // g
export const DEFAULT_WEIGHT_BASE = 65000

export type HeightWeight = [number, number]

export const HEIGHT_OPTION_LIST = [
  { value: 150, text: '150cm' },
  { value: 155, text: '155cm' },
  { value: 160, text: '160cm' },
  { value: 165, text: '165cm' },
  { value: 170, text: '170cm' },
  { value: 175, text: '175cm' },
  { value: 180, text: '180cm' },
  { value: 185, text: '185cm' },
  { value: 190, text: '190cm' },
  { value: 195, text: '195cm' },
  { value: 200, text: '200cm' },
]

const BMI_LIST = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
export const BMI_OPTION_LIST = BMI_LIST.map((bmi) => {
  return { value: bmi, text: `${bmi}` }
})

export const WEIGHT_OPTION_LIST = [
  { value: 50000, text: '50kg' },
  { value: 55000, text: '55kg' },
  { value: 60000, text: '60kg' },
  { value: 65000, text: '65kg' },
  { value: 70000, text: '70kg' },
  { value: 75000, text: '75kg' },
  { value: 80000, text: '80kg' },
  { value: 85000, text: '85kg' },
  { value: 90000, text: '90kg' },
  { value: 95000, text: '95kg' },
  { value: 100000, text: '100kg' },
]

export const HEIGHT_KNOB_STEP = 30
export const BMI_KNOB_STEP = 10
export const WEIGHT_KNOB_STEP = 10000

export function getBmi(height: number, weight: number): number {
  const heightCm = height / 100
  const weightKg = weight / 1000
  return weightKg / (heightCm * heightCm)
}

export function getHeight(bmi: number, weight: number): number {
  const weightKg = weight / 1000
  const heightCm = Math.sqrt(weightKg / bmi)
  return heightCm * 100
}

export function getWeight(bmi: number, height: number): number {
  const heightCm = height / 100
  const weightKg = bmi * heightCm * heightCm
  return weightKg * 1000
}
