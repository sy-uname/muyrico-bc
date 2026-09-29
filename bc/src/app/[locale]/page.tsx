import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

import { HomePage } from '@features'
import { GenerateMetadataProps } from '@types'
import { getCurrentOrigin } from '@helpers/getOrigin'

export async function generateMetadata({ params: { locale } }: GenerateMetadataProps) {
  const t = await getTranslations({ locale, namespace: 'Home' })
const basePath = process.env.baseSrvPath ?? ''
  return {
    metadataBase: getCurrentOrigin(),
    alternates: {
      canonical: `${basePath}/${locale}`,
    },
    title: t('metadata.title'),
    description: t('metadata.description'),
  }
}

export default function Page() {
  return <HomePage />
}
