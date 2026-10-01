'use client'

import Link from 'next/link'
import styled from 'styled-components'

import { actionLinkStyles } from '@shared/BusinessCard/BusinessCard.elements'

import '@styles/globals.css'

export const OfferActionButton = styled(Link)`
  ${actionLinkStyles}
`
