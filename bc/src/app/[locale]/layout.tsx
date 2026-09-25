import { setRequestLocale } from 'next-intl/server'

import { MainLayout } from '@features'
import { MainProvider } from '@providers'
import { RootLayoutProps } from '@types'
import { routing } from '@/i18n/routing'

export default async function RootLayout({ children, params }: RootLayoutProps) {
  setRequestLocale(params.locale)

  return (
    <MainProvider>
      <MainLayout params={params}>{children}</MainLayout>
    </MainProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
