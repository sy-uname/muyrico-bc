import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { RootLayoutProps } from '@types'
import StyledComponentsRegistry from '@lib/registry'
import { routing } from '@/i18n/routing'

import '@styles/globals.css'

export const RedirectLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
