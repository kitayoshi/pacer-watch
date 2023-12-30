import { StravaActivity } from '@/utils/strava'

export type Activity = {
  id: number
  startDateLocal: string
  type: string
  distance: number // m
  movingTime: number
  elapsedTime: number
  averageCadence: number
}

export function trimStravaActivityList(
  stravaActivityList: StravaActivity[]
): Activity[] {
  return stravaActivityList.map((stravaActivity) => {
    const { start_date_local, type, distance } = stravaActivity
    return {
      id: stravaActivity.id,
      startDateLocal: start_date_local,
      type,
      distance,
      movingTime: stravaActivity.moving_time,
      elapsedTime: stravaActivity.elapsed_time,
      averageCadence: stravaActivity.average_cadence,
    }
  })
}
