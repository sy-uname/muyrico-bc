export const dynamic = 'force-dynamic'
import { getTranslations } from 'next-intl/server'

import { HomePage } from '@features'
import { GenerateMetadataProps } from '@types'
import { getCurrentOrigin } from '@helpers/getOrigin'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params: { locale } }: GenerateMetadataProps) {
  const t = await getTranslations({ locale, namespace: 'Home' })
  const basePath = process.env.baseSrvPath ?? ''
  return {
    metadataBase: await getCurrentOrigin(),
    alternates: {
      canonical: `${basePath}/${locale === routing.defaultLocale ? '' : locale}`,
    },
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default function Page() {
  return <HomePage />
}
