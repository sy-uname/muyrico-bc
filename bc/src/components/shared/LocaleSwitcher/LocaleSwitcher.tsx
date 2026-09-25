'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'

import es from '@assets/es.svg'
import ru from '@assets/ru.svg'
import en from '@assets/us.svg'
import { routing } from '@/i18n/routing'

import { LocaleButton, LocaleSwitcherContainer } from './LocaleSwitcher.elements'

export const LocaleSwitcher = () => {
  const currentLocale = useLocale()

  const localeFlagsMap: Record<string, string> = { es, en, ru }

  return (
    <LocaleSwitcherContainer>
      {routing.locales.map((locale) => (
        <LocaleButton locale={locale} href="/" key={locale} $active={currentLocale === locale}>
          <Image src={localeFlagsMap[locale]} width={26} height={26} alt="" />
        </LocaleButton>
      ))}
    </LocaleSwitcherContainer>
  )
}
