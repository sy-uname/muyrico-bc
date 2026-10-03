'use client'

import styled, { css } from 'styled-components'

import bg from '@assets/bg.webp'

export const PageShell = styled.div`
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

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

export const GlassPanel = styled.div`
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

export const SectionHeading = styled.div`
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

export const logoContainerStyles = css`
  width: 100%;
  max-width: 190px;
  position: relative;
  display: block;

  & > * {
    display: block;
  }
`

export const LogoContainer = styled.div`
  ${logoContainerStyles}
`

export const actionLinkStyles = css`
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

export const MessageDescription = styled.p`
  font-family: Nunito, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  overflow-wrap: anywhere;
`
