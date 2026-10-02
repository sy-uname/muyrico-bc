import { setRequestLocale } from 'next-intl/server'

import { MainLayout } from '@features'
import { RootLayoutProps } from '@types'
import { routing } from '@/i18n/routing'

export default async function RootLayout({ children, params }: RootLayoutProps) {

  const resolvedParams = await params

  setRequestLocale(resolvedParams.locale)

  return (
      <MainLayout params={resolvedParams}>{children}</MainLayout>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
