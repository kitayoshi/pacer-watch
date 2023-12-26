import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { StravaActivity } from '@/utils/strava'
import { convertStravaActivitiyList } from '@/utils/log'
import { getUnixTime } from 'date-fns'

type FetchStravaActivitesOptions = {
  authorizationHeader: string
  page: number
  perPage: number
  after: number
}

async function fetchStravaActivites(options: FetchStravaActivitesOptions) {
  const { authorizationHeader, page, perPage, after } = options
  const url = new URL('/api/v3/athlete/activities', 'https://www.strava.com')
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('after', String(after))
  const res = await fetch(url, {
    headers: { Authorization: authorizationHeader },
  })
  if (!res.ok) return Promise.reject()
  const stravaActivityList = (await res.json()) as StravaActivity[]
  return stravaActivityList
}

async function fetchStravaActivitesAll(
  options: Omit<FetchStravaActivitesOptions, 'page'>
) {
  const { authorizationHeader, perPage, after } = options
  const result: StravaActivity[] = []
  let page = 1

  while (true) {
    const stravaActivityList = await fetchStravaActivites({
      authorizationHeader,
      page,
      perPage,
      after,
    })
    if (stravaActivityList.length === 0) break
    result.push(...stravaActivityList)
    page++
  }
  return result
}

export async function GET(request: NextRequest) {
  const authorizationHeader = request.headers.get('Authorization')
  if (!authorizationHeader) {
    return NextResponse.json(
      { error: 'Authorization is required' },
      { status: 401 }
    )
  }

  const after = getUnixTime(new Date(2019, 0, 1, 0, 0, 0))
  //=> Wed Jan 01 2014 00:00:00
  const stravaActivityList = await fetchStravaActivitesAll({
    authorizationHeader,
    // page: 1,
    perPage: 200,
    after,
  })

  return NextResponse.json(convertStravaActivitiyList(stravaActivityList))
}
