'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

const APP_VERSION = '1.0.9-debug'
console.log(`🚀 Insider Risk Index v${APP_VERSION} - ${new Date().toISOString()}`)
console.log(`🔍 Debug Info:`, {
  hasPosthogKey: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  nodeEnv: process.env.NODE_ENV,
  userAgent: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'server',
})

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  console.log('[PostHog] Checking initialization...', {
    hasKey: !!posthogKey,
    isLoaded: posthog.__loaded,
    key: posthogKey?.substring(0, 10) + '...',
    timestamp: new Date().toISOString()
  })
  
  if (posthogKey && !posthog.__loaded) {
    console.log('[PostHog] Initializing...')
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      loaded: (posthog) => {
        console.log('[PostHog] Successfully loaded!', posthog)
      }
    })
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[PostHog] useEffect running, checking if loaded:', posthog.__loaded)
    
    // Only identify after PostHog is fully loaded
    if (typeof window !== 'undefined' && posthog.__loaded) {
      console.log('[PostHog] PostHog is loaded, proceeding with identify...')
      
      // Generate or retrieve user ID
      let userId = localStorage.getItem('iri_user_id')
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        localStorage.setItem('iri_user_id', userId)
        console.log('[PostHog] Generated new user ID:', userId)
      } else {
        console.log('[PostHog] Retrieved existing user ID:', userId)
      }
      
      // Identify the user
      console.log('[PostHog] Calling identify with user ID:', userId)
      posthog.identify(userId, {
        platform: 'web',
        app_name: 'insider-risk-index',
        first_seen: new Date().toISOString(),
      })
      
      // Capture initial pageview
      console.log('[PostHog] Capturing pageview')
      posthog.capture('$pageview')
    } else {
      console.log('[PostHog] Not loaded yet, skipping identify')
      // Try again after a delay
      const timer = setTimeout(() => {
        if (posthog.__loaded) {
          console.log('[PostHog] Now loaded after delay, identifying...')
          let userId = localStorage.getItem('iri_user_id')
          if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
            localStorage.setItem('iri_user_id', userId)
          }
          posthog.identify(userId, {
            platform: 'web',
            app_name: 'insider-risk-index',
            first_seen: new Date().toISOString(),
          })
          posthog.capture('$pageview')
        }
      }, 1000)
      
      return () => clearTimeout(timer)
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