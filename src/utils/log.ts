import {
  StravaAthlete,
  StravaActivity,
  StravaResourceState,
  StravaBestEffortCamel,
} from '@/utils/strava'

export type Activity = {
  id: number
  name: string
  resourceState: StravaResourceState
  startDate: string
  startDateLocal: string
  type: string
  distance: number // m
  movingTime: number
  elapsedTime: number
  averageCadence: number
  bestEfforts?: StravaBestEffortCamel[]
  workoutType: number
}

export type Athlete = {
  id: number
  username: StravaAthlete['username']
  firstname: string
  lastname: string
  profile: StravaAthlete['profile']
}

export function trimStravaActivityList(
  stravaActivityList: StravaActivity[]
): Activity[] {
  return stravaActivityList.map((stravaActivity) => {
    return {
      id: stravaActivity.id,
      name: stravaActivity.name,
      resourceState: stravaActivity.resource_state,
      startDate: stravaActivity.start_date,
      startDateLocal: stravaActivity.start_date_local,
      type: stravaActivity.type,
      distance: stravaActivity.distance,
      movingTime: stravaActivity.moving_time,
      elapsedTime: stravaActivity.elapsed_time,
      averageCadence: stravaActivity.average_cadence,
      workoutType: stravaActivity.workout_type,
    }
  })
}
