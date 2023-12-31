type StravaAthlete = {
  id: number
}

export type StravaTokenPayload = {
  token_type: string // "Bearer"
  expires_at: number // 1568775134
  expires_in: number // 21600
  refresh_token: string // "e5n567567..."
  access_token: string // "a4b945687g..."
  athlete: StravaAthlete
}

export type StravaResourceState = 1 | 2 | 3 // 1: meta, 2: summary, 3: detail

type StravaActivityType = 'Run' | 'Ride'

type StravaActivityShortType = 'Run' | 'Ride'

type StravaWorkoutType = 0 | 1 // normal | race

type StravaActivityMap = {
  id: string // 'a10427767870'
  polyline?: string // polyline, for detailed activity, resource_state: 3
  summary_polyline: string // encoded polyline
  resource_state: StravaResourceState
}

export type StravaActivity = {
  resource_state: StravaResourceState // 2
  athlete: {
    id: number // 60457398
    resource_state: StravaResourceState
  }
  name: string // '旧中川 21K'
  distance: number // 21227.8
  moving_time: number // 5700
  elapsed_time: number // 5700
  total_elevation_gain: number // 59
  type: StravaActivityType
  sport_type: StravaActivityShortType
  workout_type: StravaWorkoutType // 0
  id: number // 10427767870
  start_date: string // '2023-12-24T02:25:58Z'
  start_date_local: string // '2023-12-24T11:25:58Z'
  timezone: string // '(GMT+09:00) Asia/Tokyo'
  utc_offset: number // 32400
  location_city: string | null
  location_state: string | null
  location_country: string | null // 'Japan'
  achievement_count: number // 2
  kudos_count: number // 10
  comment_count: number // 0
  athlete_count: number // 1
  photo_count: number // 0
  map: StravaActivityMap
  trainer: boolean // false
  commute: boolean // false
  manual: boolean // false
  private: boolean // false
  visibility: string // 'everyone'
  flagged: boolean
  gear_id: string // 'g14980610'
  start_latlng: [number, number] // []
  end_latlng: [number, number] // []
  average_speed: number // 3.724
  max_speed: number // 5.068
  average_cadence: number // 91.8
  average_watts: number // 380.8
  max_watts: number // 505
  weighted_average_watts: number // 382
  kilojoules: number // 2170.4
  device_watts: boolean
  has_heartrate: boolean
  average_heartrate: number // 156.4
  max_heartrate: number // 165
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high: number // 10.4
  elev_low: number // -5.6
  upload_id: number // 11160545384
  upload_id_str: string // '11160545384'
  external_id: string // 'garmin_ping_311372918808'
  from_accepted_tag: boolean
  pr_count: number // 0
  total_photo_count: number // 1
  has_kudoed: boolean
  suffer_score: number // 157
}

type StravaSummarySegment = {
  id: number // 25798191
  resource_state: StravaResourceState // 2
  name: string // '河口湖大橋ダッシュ'
  activity_type: StravaActivityType // 'Run'
  distance: number // 684.4
  average_grade: number // 0
  maximum_grade: number // 4.9
  elevation_high: number // 850.5
  elevation_low: number // 843.2
  start_latlng: [number, number] // [35.508977, 138.762195]
  end_latlng: [number, number] // [35.514041, 138.76669]
  elevation_profile: string | null // null, not sure
  climb_category: number // 0
  city: string // 'Fujikawaguchiko'
  state: string // 'Yamanashi'
  country: string // 'Japan'
  private: boolean // false
  hazardous: boolean // false
  starred: boolean //false
}

type StravaAchievement = {
  type_id: number // 3
  type: string // 'pr'
  rank: number // 2
}

type StravaAchievementCamel = {
  typeId: number // 3
  type: string // 'pr'
  rank: number // 2
}

type StravaDetailedSegmentEffort = {
  id: number // 3163703837301247000
  resource_state: StravaResourceState // 2
  name: string // '河口湖大橋ダッシュ'
  activity: {
    id: number // 10282173217
    visibility: string // 'everyone'
    resource_state: StravaResourceState // 1
  }
  athlete: {
    id: number // 60457398
    resource_state: StravaResourceState // 1
  }
  elapsed_time: number // 179
  moving_time: number // 179
  start_date: string // '2023-11-26T00:51:28Z'
  start_date_local: string // '2023-11-26T09:51:28Z'
  distance: number // 684.4
  start_index: number // 3079
  end_index: number // 3258
  average_cadence: number // 90.7
  device_watts: boolean // true
  average_watts: number // 395.7
  average_heartrate: number // 163.6
  max_heartrate: number // 167
  segment: StravaSummarySegment
  pr_rank: number | null // null
  achievements: StravaAchievement[]
  visibility: string // 'everyone'
  kom_rank: number | null // null
  hidden: boolean // false
}

type StravaBestEffortName =
  | '400m'
  | '1/2 mile'
  | '1k'
  | '1 mile'
  | '2 mile'
  | '5k'
  | '10k'
  | '15k'
  | '10 mile'
  | '20k'
  | 'Half-Marathon'
  | '30k'
  | 'Marathon'

export type StravaBestEffort = {
  id: number // 30648108407
  resource_state: StravaResourceState // 2
  name: StravaBestEffortName
  activity: {
    id: number // 10282173217
    visibility: string // 'everyone'
    resource_state: StravaResourceState // 1
  }
  athlete: {
    id: number // 60457398
    resource_state: StravaResourceState // 1
  }
  elapsed_time: number // 91
  moving_time: number // 91
  start_date: string // '2023-11-26T00:01:24Z'
  start_date_local: string //'2023-11-26T09:01:24Z'
  distance: number // 400
  pr_rank: number | null // null
  achievements: StravaAchievement[]
  start_index: number // 75
  end_index: number // 166
}

export type StravaBestEffortCamel = {
  id: number // 30648108407
  resourceState: StravaResourceState // 2
  name: StravaBestEffortName
  activity: {
    id: number // 10282173217
    visibility: string // 'everyone'
    resourceState: StravaResourceState // 1
  }
  athlete: {
    id: number // 60457398
    resourceState: StravaResourceState // 1
  }
  elapsedTime: number // 91
  movingTime: number // 91
  startDate: string // '2023-11-26T00:01:24Z'
  startDateLocal: string //'2023-11-26T09:01:24Z'
  distance: number // 400
  prRank: number | null // null
  achievements: StravaAchievementCamel[]
  startIndex: number // 75
  endIndex: number // 166
}

type StravaSplit = {
  distance: number // 1003.2
  elapsed_time: number // 252
  elevation_difference: number // 14.8
  moving_time: number // 245
  split: number // 1
  average_speed: number // 3.98
  average_grade_adjusted_speed: number // 4.19
  average_heartrate: number // 137.45081967213116
  pace_zone: number // 5
}

type StravaLap = {
  id: number // 35361401847
  resource_state: StravaResourceState // 2
  name: string // 'Lap 1'
  activity: {
    id: number // 10282173217
    visibility: string // 'everyone'
    resource_state: StravaResourceState // 1
  }
  athlete: {
    id: number // 60457398
    resource_state: StravaResourceState // 1
  }
  elapsed_time: number // 252
  moving_time: number // 245
  start_date: string // '2023-11-26T00:00:03Z'
  start_date_local: string // '2023-11-26T09:00:03Z'
  distance: number // 1000
  average_speed: number // 3.97
  max_speed: number // 4.886
  lap_index: number // 1
  split: number // 1
  start_index: number // 0
  end_index: number // 246
  total_elevation_gain: number // 15.4
  average_cadence: number // 91.7
  device_watts: boolean // true
  average_watts: number // 468.6
  average_heartrate: number // 137.5
  max_heartrate: number // 151
  pace_zone: number // 5
}

type StravaGear = {
  id: string // 'g15062005'
  primary: boolean // false
  name: string // 'ASICS Metaspeed Sky+ MSP'
  nickname: string // 'MSP'
  resource_state: StravaResourceState //  2
  retired: boolean // false
  distance: number // 182410
  converted_distance: number // 182.4
}

type StravaPhotos = {
  primary: {
    unique_id: string // '51970A37-1A53-447E-A420-57E3955B253E'
    urls: {
      '100': string // 'https://dgtzuqphqg23d.cloudfront.net/l98wikkpzRDOlS6_tkiXOxIrdAm20torzCHAM_bjgHk-128x128.jpg'
      '600': string // 'https://dgtzuqphqg23d.cloudfront.net/l98wikkpzRDOlS6_tkiXOxIrdAm20torzCHAM_bjgHk-768x768.jpg'
    }
    source: number // 1
    media_type: number // 1
  } | null
  use_primary_photo: boolean // false
  count: number // 4
}

type StravaVisibility = {
  type: 'heart_rate' | 'pace' | 'power' | 'speed' | 'calories'
  visibility: string // 'everyone'
}

type StravaDetailedActivity = {
  resource_state: StravaResourceState // 3
  athlete: {
    id: number // 60457398
    resource_state: StravaResourceState // 1
  }
  name: string // '第12回 富士山マラソン'
  distance: number // 42660.4
  moving_time: number // 11614
  elapsed_time: number // 11621
  total_elevation_gain: number // 338
  type: StravaActivityType // 'Run'
  sport_type: StravaActivityShortType // 'Run'
  workout_type: StravaWorkoutType // 1
  id: number // 10282173217
  start_date: string // '2023-11-26T00:00:03Z'
  start_date_local: string // '2023-11-26T09:00:03Z'
  timezone: string // '(GMT+09:00) Asia/Tokyo'
  utc_offset: number // 32400
  location_city: string | null
  location_state: string | null
  location_country: string | null //  'Japan'
  achievement_count: number // 7
  kudos_count: number // 14
  comment_count: number // 0
  athlete_count: number // 6
  photo_count: number // 0
  map: StravaActivityMap
  trainer: boolean // false
  commute: boolean // false
  manual: boolean // false
  private: boolean // false
  visibility: string // 'everyone'
  flagged: boolean // false
  gear_id: string // 'g15062005'
  start_latlng: [number, number]
  end_latlng: [number, number]
  average_speed: number // 3.671
  max_speed: number // 7.708
  average_cadence: number // 92.4
  average_watts: number // 374.8
  max_watts: number // 598
  weighted_average_watts: number // 381
  kilojoules: number // 4353.2
  device_watts: boolean // true
  has_heartrate: boolean // true
  average_heartrate: number // 158.5
  max_heartrate: number // 172
  heartrate_opt_out: boolean // false
  display_hide_heartrate_option: boolean // true
  elev_high: number // 929.4
  elev_low: number // 827.2
  upload_id: number // 11009365747
  upload_id_str: string // '11009365747'
  external_id: string // 'garmin_ping_306683031315'
  from_accepted_tag: boolean // false
  pr_count: number // 4
  total_photo_count: number //  4
  has_kudoed: number // false
  suffer_score: number // 367
  description: string // '128HALF + 145LSD！'
  calories: number // 2977
  perceived_exertion: number | null // null
  prefer_perceived_exertion: boolean // false
  segment_efforts: StravaDetailedSegmentEffort[]
  splits_metric: StravaSplit[]
  splits_standard: StravaSplit[]
  laps: StravaLap[]
  best_efforts: StravaBestEffort[]
  gear: StravaGear | null
  photos: StravaPhotos
  stats_visibility: StravaVisibility[]
  hide_from_home: boolean // false
  device_name: string // 'Garmin epix Pro (Gen 2) 47mm'
  embed_token: string // '189539f7667db3cfb909bd5aea440bb786adc07d'
  similar_activities: {
    effort_count: number // 1
    average_speed: number // 3.673191770169623
    min_average_speed: number // 3.673191770169623
    mid_average_speed: number // 3.673191770169623
    max_average_speed: number // 3.673191770169623
    pr_rank: number | null // null
    frequency_milestone: number | null // null
    trend: {
      speeds: number[] // [3.673191770169623]
      current_activity_index: number // 0
      min_speed: number // 3.673191770169623
      mid_speed: number // 3.673191770169623
      max_speed: number // 3.673191770169623
      direction: number // 0
    }
    resource_state: StravaResourceState // 2
  }
  available_zones: string[] // ['heartrate', 'pace', 'power']
}

type FetchStravaActivityListOptions = {
  accessToken: string
  page?: number
  perPage?: number
  before?: number
  after?: number
}

export async function fetchStravaActivityList(
  options: FetchStravaActivityListOptions
) {
  const { accessToken, page, perPage, before, after } = options
  const url = new URL('/api/v3/athlete/activities', 'https://www.strava.com')
  if (page) url.searchParams.set('page', String(page))
  if (perPage) url.searchParams.set('per_page', String(perPage))
  if (before) url.searchParams.set('before', String(before))
  if (after) url.searchParams.set('after', String(after))
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return Promise.reject()
  const stravaActivityList = (await res.json()) as StravaActivity[]
  return stravaActivityList
}

const MAX_RESULT = 800

export async function fetchStravaActivityListAll(
  options: Omit<FetchStravaActivityListOptions, 'page'>
) {
  const result: StravaActivity[] = []
  let page = 1

  while (true) {
    const stravaActivityList = await fetchStravaActivityList({
      ...options,
      page,
    })
    result.push(...stravaActivityList)
    if (stravaActivityList.length < (options.perPage || 30)) break
    if (result.length > MAX_RESULT) break
    page++
  }

  return result
}

type FetchStravaAthleteOptions = {
  accessToken: string
}

export async function fetchStravaAthlete(options: FetchStravaAthleteOptions) {
  const { accessToken } = options
  const url = new URL('/api/v3/athlete', 'https://www.strava.com')
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return Promise.reject()
  const stravaAthlete = (await res.json()) as StravaAthlete
  return stravaAthlete
}

type FetchStravaActivityOptions = {
  accessToken: string
  id: number
  includeAllEfforts?: boolean
}

export async function fetchStravaActivity(options: FetchStravaActivityOptions) {
  const { accessToken, id, includeAllEfforts } = options
  const url = new URL(`/api/v3/activities/${id}`, 'https://www.strava.com')
  if (includeAllEfforts) url.searchParams.set('include_all_efforts', 'true')

  console.log(url)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return Promise.reject(res)
  const stravaActivityList = (await res.json()) as StravaActivity
  return stravaActivityList
}
