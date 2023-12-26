type StravaAthlete = {}

export type StravaTokenPayload = {
  token_type: string // "Bearer"
  expires_at: number // 1568775134
  expires_in: number // 21600
  refresh_token: string // "e5n567567..."
  access_token: string // "a4b945687g..."
  athlete: StravaAthlete
}

type StravaResourceState = 1 | 2 | 3 // 1: meta, 2: summary, 3: detail

type StravaActivityType = 'Run' | 'Ride'

type StravaActivityShortType = 'Run' | 'Ride'

export type StravaActivity = {
  resource_state: StravaResourceState
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
  workout_type: number // 0
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
  map: {
    id: string // 'a10427767870'
    summary_polyline: string // encoded polyline
    resource_state: StravaResourceState
  }
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
