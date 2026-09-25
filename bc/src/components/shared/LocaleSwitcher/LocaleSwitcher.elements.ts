import styled, { css } from 'styled-components'

import { Link } from '@core/Link'

export const LocaleSwitcherContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`

export const LocaleButton = styled(Link)<{ $active: boolean }>`
  height: 26px;
  padding: 5px;
  border-radius: 2px;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.25);
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: rgba(255, 255, 255, 0.25) !important;
    `}
`
