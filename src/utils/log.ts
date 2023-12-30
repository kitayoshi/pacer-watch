import { StravaActivity } from '@/utils/strava'

export type Activity = {
  id: number
  startDate: string
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
    return {
      id: stravaActivity.id,
      startDate: stravaActivity.start_date,
      startDateLocal: stravaActivity.start_date_local,
      type: stravaActivity.type,
      distance: stravaActivity.distance,
      movingTime: stravaActivity.moving_time,
      elapsedTime: stravaActivity.elapsed_time,
      averageCadence: stravaActivity.average_cadence,
    }
  })
}
