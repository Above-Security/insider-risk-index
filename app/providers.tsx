'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  if (posthogKey && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
    })
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only identify after PostHog is fully loaded
    if (typeof window !== 'undefined' && posthog.__loaded) {
      // Generate or retrieve user ID
      let userId = localStorage.getItem('iri_user_id')
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        localStorage.setItem('iri_user_id', userId)
      }
      
      // Identify the user
      posthog.identify(userId, {
        platform: 'web',
        app_name: 'insider-risk-index',
        first_seen: new Date().toISOString(),
      })
      
      // Capture initial pageview
      posthog.capture('$pageview')
    }
  }, [])

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.error('PostHog initialization failed: NEXT_PUBLIC_POSTHOG_KEY is not defined')
    return <>{children}</>
  }

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}