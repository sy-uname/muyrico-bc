'use server'

import { setRequestLocale } from 'next-intl/server'

import { RootLayoutProps } from '@types'
import StyledComponentsRegistry from '@lib/registry'
import { routing } from '@/i18n/routing'
import { GoogleAnalytics } from '@next/third-parties/google'

export default async function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        {/* Layout UI */}
        <StyledComponentsRegistry>
          <main>{children}</main>
        </StyledComponentsRegistry>
      </body>
      <GoogleAnalytics gaId={process.env.gaId || ''} />
    </html>
  )
}
