import { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'

const hrefBaseUrl = process.env.hrefBaseUrl as string

function sitemapEntry(
  baseURL: string,
  url: string,
  lastModified: Date,
  changeFrequency: string,
  priority: number,
): MetadataRoute.Sitemap[0] {
  const addURL = url ? '/' + url : ''
  const altLanguages: Record<string, any> = {}
  const entry = {
    url: baseURL + addURL,
    lastModified: lastModified,
    alternates: {
      languages: altLanguages,
    },
    priority: priority,
  }
  routing.locales.forEach((locale) => {
    entry.alternates.languages[locale] = `${baseURL}/${locale}${addURL}`
  })
  return entry
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [sitemapEntry(hrefBaseUrl, '', new Date(), 'weekly', 1)]
}
