import { NextResponse } from 'next/server'

import { postData } from '@/app/actions'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'default'

  const headersList = request.headers
  const userAgent = headersList.get('user-agent') || 'unknown'

  // Здесь можно вызвать postData, если он нужен на сервере
  const data = await postData({ source, userAgent })

  return NextResponse.json({ data })
}
