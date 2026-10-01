'use client'

import Link from 'next/link'
import styled from 'styled-components'

import logo from '@assets/logo.png'
import { ResponsiveImage } from '@core/ResponsiveImage'
import StyledComponentsRegistry from '@lib/registry'
import { routing } from '@/i18n/routing'
import {
  PageShell,
  GlassPanel,
  LogoContainer,
  SectionHeading,
  actionLinkStyles,
  MessageDescription,
} from '@shared/BusinessCard/BusinessCard.elements'

import '@styles/globals.css'

const OfferActionButton = styled(Link)`
  ${actionLinkStyles}
`

export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <StyledComponentsRegistry>
          <PageShell>
            <LogoContainer>
              <ResponsiveImage src={logo.src} />
            </LogoContainer>
            <GlassPanel>
              <title>No Encontrado | MUY RICO GRUPO</title>
              <SectionHeading as="h1">{404}</SectionHeading>
              <MessageDescription>la página no fue encontrada</MessageDescription>
              <OfferActionButton href="/">Volver a la página principal</OfferActionButton>
            </GlassPanel>
          </PageShell>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
