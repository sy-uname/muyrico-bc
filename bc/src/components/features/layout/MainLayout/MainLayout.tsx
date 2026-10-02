import { useMessages, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

import { MainLayoutProps } from '@types'
import StyledComponentsRegistry from '@lib/registry'
import { routing } from '@/i18n/routing'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

import '@styles/globals.css'

export const MainLayout = ({ children, locale }: MainLayoutProps) => {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = useMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </NextIntlClientProvider>
        {process.env.gtmId && <GoogleTagManager gtmId={process.env.gtmId || ''} />}
        {process.env.gaId && <GoogleAnalytics gaId={process.env.gaId || ''} />}
      </body>
    </html>
  )
}
