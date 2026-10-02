import { setRequestLocale } from 'next-intl/server'

import { MainLayout } from '@features'
import { LocaleLayoutProps } from '@types'
import { routing } from '@/i18n/routing'

export default async function RootLayout({ children, params }: LocaleLayoutProps) {

  const { locale } = await params

  setRequestLocale(locale)

  return (
      <MainLayout locale={locale}>{children}</MainLayout>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
