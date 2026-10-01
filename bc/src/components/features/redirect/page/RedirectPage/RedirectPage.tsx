'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import { useRouter, useSearchParams } from 'next/navigation'

import logo from '@assets/logo.png'
import { ResponsiveImage } from '@core/ResponsiveImage'
import {
  PageShell,
  GlassPanel,
  LogoContainer,
  SectionHeading,
  MessageDescription,
} from '@shared/BusinessCard/BusinessCard.elements'

import { OfferActionButton } from './RedirectPage.elements'
import { RedirectPageProps } from './RedirectPage.types'

export const RedirectPage = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <PageShell>
      <LogoContainer>
        <ResponsiveImage src={logo.src} />
      </LogoContainer>
      <GlassPanel>
        <SectionHeading as="h1">QR Code Scan</SectionHeading>
        <MessageDescription>
          Bienvenido a la página de servicios de nuestro punto vienta en Piedades, Santa Ana.
        </MessageDescription>
        <OfferActionButton href="/">Volver a la página principal</OfferActionButton>
      </GlassPanel>
    </PageShell>
  )
}
