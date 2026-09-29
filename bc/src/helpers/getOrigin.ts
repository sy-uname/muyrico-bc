import 'server-only'
import { headers } from 'next/headers'

export function getCurrentOrigin(): URL {
  const h = headers()

  const host =
    h.get('x-forwarded-host') ??
    h.get('host')

  const protocol =
    h.get('x-forwarded-proto') ?? 'https'

  if (!host) {
    throw new Error('Cannot determine request host')
  }

  return new URL(`${protocol}://${host}`)
}
