import { type NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { StravaTokenPayload } from '@/utils/strava'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'code is required' }, { status: 401 })
  }

  const url = new URL('/api/v3/oauth/token', 'https://www.strava.com')
  if (process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID) {
    url.searchParams.append(
      'client_id',
      process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
    )
  }
  if (process.env.STRAVA_CLIENT_SECRET) {
    url.searchParams.append('client_secret', process.env.STRAVA_CLIENT_SECRET)
  }
  url.searchParams.append('code', code)
  url.searchParams.append('grant_type', 'authorization_code')

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return NextResponse.error()
  const data = (await res.json()) as StravaTokenPayload
  const accessToken = data.access_token
  const athleteId = data.athlete.id
  const redirectUrl = new URL('/', request.nextUrl)
  redirectUrl.searchParams.append(
    'set_strava_token',
    [athleteId, accessToken].join('.')
  )
  return NextResponse.redirect(redirectUrl)
}
