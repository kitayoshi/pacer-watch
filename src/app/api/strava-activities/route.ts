import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { getUnixTime } from 'date-fns'

import { fetchStravaActivitesAll, fetchStravaAthlete } from '@/utils/strava'
import { LogMapData, convertStravaActivitiyList } from '@/utils/log'

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
    const kvLogMapData = await kv.get<LogMapData>(athleteId)
    if (kvLogMapData) return NextResponse.json(kvLogMapData)
  }

  const stravaActivityList = await fetchStravaActivitesAll({
    accessToken,
    perPage: 200,
    before: getUnixTime(new Date()),
    after: getUnixTime(new Date(2023, 0, 1, 0, 0, 0)),
  })
  const logMapData = convertStravaActivitiyList(stravaActivityList)
  await kv.set(athleteId, logMapData)

  return NextResponse.json(logMapData)
}
