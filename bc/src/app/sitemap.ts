import type { MetadataRoute } from 'next'

import { getCurrentOrigin } from '@helpers/getOrigin'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (await getCurrentOrigin()).origin
  const basePath = process.env.baseSrvPath ?? ''
  const baseUrl = `${origin}${basePath}`

  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      locale === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`,
    ]),
  )

  return routing.locales.map((locale) => ({
    url: locale === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}`,

    alternates: {
      languages,
    },
  }))
}
