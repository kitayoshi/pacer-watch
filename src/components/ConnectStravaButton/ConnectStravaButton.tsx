'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import BtnStravaConnectwithOrangeImage from './images/btn_strava_connectwith_orange.svg?url'
import styles from './ConnextStravaButton.module.css'

function ConnectStravaButton() {
  const stravaOauthUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const url = new URL('/oauth/authorize', 'https://www.strava.com')

    if (process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID) {
      url.searchParams.append(
        'client_id',
        process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
      )
    }

    const redirectUri = new URL(
      '/api/strava-oauth-callback',
      window.location.origin
    )
    url.searchParams.append('redirect_uri', redirectUri.toString())
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('approval_prompt', 'auto')
    url.searchParams.append(
      'scope',
      ['read', 'profile:read_all', 'activity:read', 'activity:read_all'].join(
        ','
      )
    )

    return url.toString()
  }, [])

  return (
    <a href={stravaOauthUrl} className={styles.root}>
      <Image src={BtnStravaConnectwithOrangeImage} alt="Connect with Strava" />
    </a>
  )
}

export default ConnectStravaButton
