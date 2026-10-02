'use server'

const DEFAULT_SCAN_BACKEND_URL = 'http://localhost:3016/scan'
const DEFAULT_SCAN_REQUEST_TIMEOUT_MS = 3000

const getServerDBURL = () => process.env.SCAN_BACKEND_URL ?? DEFAULT_SCAN_BACKEND_URL
const getScanRequestTimeout = (): number => {
  const configuredTimeout = Number(process.env.SCAN_REQUEST_TIMEOUT_MS)

  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_SCAN_REQUEST_TIMEOUT_MS
}

const getDeviceType = (userAgent: string) => {
  const ua = userAgent.toLowerCase()

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'iphone'
  } else if (/android/.test(ua)) {
    return 'android'
  } else if (/windows/.test(ua)) {
    return 'windows'
  } else {
    return 'unknown'
  }
}

export type PostDataContext = { source: string; userAgent: string }

export async function postData(context: PostDataContext): Promise<unknown> {
  if (!context.source || context.source == 'default') {
    console.info('Scan tracking', { outcome: 'skipped', reason: 'empty_or_default_source' })
    return null
  }

  const data = {
    source: context.source || 'Common',
    device: getDeviceType(context.userAgent || 'unknown'),
  }

  const controller = new AbortController()
  const startedAt = Date.now()
  const timer = setTimeout(() => controller.abort(), getScanRequestTimeout())
  let stage: 'request' | 'response_body' = 'request'
  let status: number | undefined

  try {
    const response = await fetch(getServerDBURL(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    status = response.status

    if (!response.ok) {
      console.error('Scan tracking', {
        outcome: 'failed',
        reason: 'http_error',
        status,
        durationMs: Date.now() - startedAt,
      })
      return null
    }

    stage = 'response_body'
    const resultData: unknown = await response.json()
    console.info('Scan tracking', {
      outcome: 'success',
      status,
      durationMs: Date.now() - startedAt,
    })
    return resultData
  } catch (error: unknown) {
    console.error('Scan tracking', {
      outcome: 'failed',
      reason: controller.signal.aborted
        ? 'timeout'
        : stage === 'request'
          ? 'request_error'
          : 'response_body_error',
      stage,
      status,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      durationMs: Date.now() - startedAt,
    })
    return null
  } finally {
    clearTimeout(timer)
  }
}
