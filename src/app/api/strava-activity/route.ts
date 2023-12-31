import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Activity } from '@/utils/log'

import { fetchStravaActivity, fetchStravaAthlete } from '@/utils/strava'
import { objectSnakeToCamel } from '@/utils/case'

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get('x-strava-access-token')
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Authorization is required' },
      { status: 401 }
    )
  }
  const id = request.nextUrl.searchParams.get('id')
  const athlete = await fetchStravaAthlete({ accessToken })
  const athleteId = String(athlete.id)

  const kvActivityList = await kv.get<Activity[]>(athleteId)
  const kvActivity = kvActivityList?.find((a) => a.id === Number(id))

  if (!kvActivityList || !kvActivity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // fetched
  if (kvActivity.resourceState === 3) {
    return NextResponse.json(kvActivity)
  }

  const stravaActivity = await fetchStravaActivity({
    accessToken,
    id: Number(id),
  })

  const updatedKvActivityList =
    kvActivityList.map((activity) => {
      if (activity.id === Number(id)) {
        return objectSnakeToCamel(stravaActivity)
      }
      return activity
    }, []) || []

  await kv.set(athleteId, updatedKvActivityList)

  return NextResponse.json(objectSnakeToCamel(stravaActivity))
}
