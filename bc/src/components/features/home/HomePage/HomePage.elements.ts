import styled from 'styled-components'

import { Link } from '@core/Link'
import bg from '@assets/bg.webp'

export const HomePageContainer = styled.div`
  padding: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 100vh;
  background-image: url('${bg.src}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 25% 0%;
`

export const LogoContainer = styled(Link)`
  width: 100%;
  max-width: 190px;
  position: relative;
  display: block;

  & > * {
    display: block;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

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

export const ButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow:
    0 3px 3px -2px rgba(0, 0, 0, 0.2),
    0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(8px);
  position: relative;
`

export const ButtonsSectionTitile = styled.div`
  font-weight: 700;
  font-size: 18px;
  padding: 8px 15px;
  background-blend-mode: multiply;
  border-radius: 10px;
  text-transform: uppercase;
  font-family: Rubik, sans-serif;
  color: transparent;
  background: linear-gradient(to right, rgb(255 84 108), rgb(255 152 45));
  -webkit-background-clip: text;
  background-clip: text;
  text-align: center;
`

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
  text-transform: capitalize;
  padding: 5px 15px;
  color: #fff;
  font-weight: 600;
  background-color: #ed4c1a;
  border-radius: 4px;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    cursor: pointer;
    background-color: #d33d0f;
  }

  &:active {
    background-color: #c5360a;
  }
`
