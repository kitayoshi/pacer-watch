import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
// import { kv } from '@vercel/kv'
// import { Activity } from '@/utils/log'

import { fetchStravaAthlete } from '@/utils/strava'
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

  return NextResponse.json(objectSnakeToCamel(athlete))
}
