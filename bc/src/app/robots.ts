import { MetadataRoute } from 'next'
import { getCurrentOrigin } from '@helpers/getOrigin'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = (await getCurrentOrigin()).origin
  const basePath = process.env.baseSrvPath ?? ''

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${origin}${basePath}/sitemap.xml`,
  }
}
