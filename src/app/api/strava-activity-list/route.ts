import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getUnixTime } from 'date-fns'

import { fetchStravaActivityListAll, fetchStravaAthlete } from '@/utils/strava'
import { Activity, trimStravaActivityList } from '@/utils/log'
import { objectSnakeToCamel } from '@/utils/case'

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get('x-strava-access-token')
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Authorization is required' },
      { status: 401 }
    )
  }
  const athlete = await fetchStravaAthlete({ accessToken })
  const athleteId = String(athlete.id)

  const refresh = request.nextUrl.searchParams.get('refresh')

  if (!refresh) {
    const kvActivityList = await kv.get<Activity[]>(athleteId)
    if (kvActivityList) return NextResponse.json(kvActivityList)
  }

  const stravaActivityList = await fetchStravaActivityListAll({
    accessToken,
    perPage: 200,
    before: getUnixTime(new Date()),
    after: getUnixTime(new Date(2025, 0, 1, 0, 0, 0)),
  })

  const activityList = trimStravaActivityList(stravaActivityList)
  if (refresh) {
    await kv.del(athleteId)
  }
  await kv.set(athleteId, activityList)

  if (refresh) {
    return NextResponse.json(stravaActivityList.map(objectSnakeToCamel))
  }

  return NextResponse.json(activityList)
}
