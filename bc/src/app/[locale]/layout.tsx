import { setRequestLocale } from 'next-intl/server'

import { MainLayout } from '@features'
import { RootLayoutProps } from '@types'
import { routing } from '@/i18n/routing'

export default async function RootLayout({ children, params }: RootLayoutProps) {
  setRequestLocale(params.locale)

  return (
      <MainLayout params={params}>{children}</MainLayout>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
