import styled from 'styled-components'

import { Link } from '@core/Link'
import {
  PageShell,
  GlassPanel,
  PageContent,
  SectionHeading,
  actionLinkStyles,
  logoContainerStyles,
} from '@shared/BusinessCard/BusinessCard.elements'

export const HomePageContainer = PageShell

export const HomePageHeading = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`

export const LogoContainer = styled(Link)`
  ${logoContainerStyles}
`

export const ContentContainer = PageContent

export const LocaleSwitcherSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 5px 10px;
  border-radius: 6px;
  box-shadow:
    0 3px 3px -2px rgba(0, 0, 0, 0.2),
    0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
  width: fit-content;
  backdrop-filter: blur(8px);
  position: relative;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const ButtonsSection = GlassPanel

export const ButtonsSectionTitile = SectionHeading

export const ButtonsSectionButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
`

export const LinkButton = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
  color: #222;
  min-width: 82px;
  text-decoration: none;

  & > img {
    border-radius: 10px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.15);
  }
`

export const ButtonTitle = styled.span`
  font-size: 16px;
  text-align: center;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  max-width: 90px;
`

export const OfferContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`

export const OfferTitle = styled.div`
  text-align: center;
  font-size: 20px;
  color: rgb(225 85 0);
`

export const OfferValue = styled.div`
  text-align: center;
  font-size: 20px;
  color: rgb(255 152 45);
  margin-top: 6px;
`

export const OfferActionButton = styled(Link)`
  ${actionLinkStyles}
`
