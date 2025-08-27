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
  } else {
    console.error('PostHog initialization failed: NEXT_PUBLIC_POSTHOG_KEY is not defined')
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}