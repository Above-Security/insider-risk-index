export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation (if needed in future)
    return
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation (if needed in future)
    return
  }
}