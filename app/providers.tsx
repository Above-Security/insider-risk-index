'use client'
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2025-05-24',
      person_profiles: 'always',
    })
    
    // Identify user after initialization
    // Using a unique ID from localStorage or generating a new one
    let userId = localStorage.getItem('user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      localStorage.setItem('user_id', userId)
    }
    
    posthog.identify(userId, {
      // User properties
      platform: 'web',
      app_name: 'insider-risk-index',
      first_seen: new Date().toISOString(),
    })
  } else {
    console.error('PostHog initialization failed: NEXT_PUBLIC_POSTHOG_KEY is not defined')
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}