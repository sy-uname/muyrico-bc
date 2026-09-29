'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  OfferActionButton,
  RedirectPageTitle,
  RedirectPageContainer,
  RedirectPageDescription,
} from './RedirectPage.elements'
import { RedirectPageProps } from './RedirectPage.types'

export const RedirectPage = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <RedirectPageContainer>
      <RedirectPageTitle>QR Code Scan</RedirectPageTitle>
      <RedirectPageDescription>
        Bienvenido a la página de servicios de nuestro punto vienta en Piedades, Santa Ana.
      </RedirectPageDescription>
      <OfferActionButton href="/">Volver a la página principal</OfferActionButton>
    </RedirectPageContainer>
  )
}
