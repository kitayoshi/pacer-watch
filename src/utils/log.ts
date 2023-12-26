import { quantileSeq } from 'mathjs'

import { StravaActivity } from '@/utils/strava'

export type Activity = {
  year: number
  type: string
  date: string // yyyy-MM-dd
  distance: number // m
}

export type LogMap = Record<string, Activity[]>

export type LogMapData = {
  logMap: LogMap
  quantile: [number, number, number, number, number]
}

export function convertStravaActivitiyList(
  stravaActivityList: StravaActivity[],
  initLogMap: LogMap = {}
) {
  const logMap = stravaActivityList.reduce((acc, activity) => {
    const date = activity.start_date_local.split('T')[0]
    const year = Number(date.split('-')[0])
    const type = activity.type
    const distance = activity.distance
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push({ year, type, date, distance })
    return acc
  }, initLogMap)

  const quantile = quantileSeq(
    stravaActivityList.map((activity) => activity.distance),
    [0, 0.25, 0.5, 0.75, 1]
  ) as [number, number, number, number, number]

  return { logMap, quantile }
}
