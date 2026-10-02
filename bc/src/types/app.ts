import { ReactNode } from 'react'

import { typographyVariants } from '@styles/typography-variants'
import { Locale } from '@/i18n/routing'

export type RootLayoutProps = {
  children: ReactNode
}

export type LocaleParams = {
  locale: Locale
}

export type LocaleLayoutProps = RootLayoutProps & {
  params: Promise<LocaleParams>
}

export type MainLayoutProps = RootLayoutProps & LocaleParams

export type TypographyVariantLiterals = keyof typeof typographyVariants

//export type GenerateMetadataProps = Pick<RootLayoutProps, 'params'>
export type GenerateMetadataProps = {
  params: Promise<LocaleParams>
}
