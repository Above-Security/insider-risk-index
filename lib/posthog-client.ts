import posthog from 'posthog-js'

// Initialize PostHog on the client side
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll handle this manually for better control
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog loaded successfully')
      }
    }
  })
}

export { posthog }
export default posthog