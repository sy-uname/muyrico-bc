import { headers } from 'next/headers'
import 'server-only'

export async function getCurrentOrigin(): Promise<URL> {
  const h = await headers()

  const host = h.get('x-forwarded-host') ?? h.get('host')

  const protocol = h.get('x-forwarded-proto') ?? 'https'

  if (!host) {
    throw new Error('Cannot determine request host')
  }

  return new URL(`${protocol}://${host}`)
}
