import { useMessages, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import { RootLayoutProps } from '@types'
import StyledComponentsRegistry from '@lib/registry'
import { routing } from '@/i18n/routing'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

import '@styles/globals.css'

export const MainLayout = ({ children, params: { locale } }: RootLayoutProps) => {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = useMessages()

  return (
    <html lang={locale}>
        <GoogleTagManager gtmId={process.env.gtmId || ''} />
      <body>
        <NextIntlClientProvider messages={messages}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={process.env.gaId || ''} />
    </html>
  )
}
