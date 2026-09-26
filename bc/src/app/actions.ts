'use server'

const getServerDBURL = () => {
  const url = 'http://localhost:3016/scan'
  return url
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

export async function postData(context: PostDataContext) {
  console.log('call PostData', context)

  if (!context.source || context.source == 'default') return null
  const data = {
    source: context.source || 'Common',
    // Определите тип устройства
    device: getDeviceType(context.userAgent || 'unknown'),
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }

  try {
    const response = await fetch(getServerDBURL(), requestOptions)
    if (!response.ok) {
      console.error('Server error:', response.status, response.statusText)
      return null
    }

    const resultData = await response.json()

    return resultData
  } catch (err) {
    console.log(err)
    return null
  }
}
