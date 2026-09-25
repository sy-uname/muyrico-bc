import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { RedirectPage } from '@features'
import { GenerateMetadataProps } from '@types'
import { routing } from '@/i18n/routing'
import { postData } from '@/app/actions'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'Redirect' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default async function Page({ searchParams }: Props) {
  const raw = searchParams.source
  const source = Array.isArray(raw) ? raw[0] : raw || ''
  const userAgent = headers().get('user-agent') || 'unknown'

  await postData({ source, userAgent })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectPage />
    </Suspense>
  )
}
