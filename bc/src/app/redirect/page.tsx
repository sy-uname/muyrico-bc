export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { RedirectPage } from '@features'
import { routing } from '@/i18n/routing'
import { postData } from '@/app/actions'
import { getCurrentOrigin } from '@helpers/getOrigin'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'Redirect' })

  return {
    metadataBase: await getCurrentOrigin(),
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const raw = resolvedSearchParams.source
  const source = Array.isArray(raw) ? raw[0] : raw || ''
  const userAgent = (await headers()).get('user-agent') || 'unknown'

  await postData({ source, userAgent })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectPage />
    </Suspense>
  )
}
