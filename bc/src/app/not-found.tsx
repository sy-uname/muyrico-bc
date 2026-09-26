'use client'

import Error from 'next/error'
import Link from 'next/link'
import styled from 'styled-components'

import { routing } from '@/i18n/routing'

import '@styles/globals.css'

export const NotFoundPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: calc(100vh - 80px - 251px);
  flex-direction: column;
`

export const NotFoundTitle = styled.h1`
  font-size: 100px;
  font-weight: 500;
  font-family: 'Rubik', sans-serif;
  color: rgb(225 85 0);
`

export const NotFoundDescription = styled.h3`
  margin-bottom: 20px;
  font-size: 30px;
  text-align: center;
  color: rgb(225 85 0);
`

export const ActionButtonContainer = styled.div`
  margin-top: 30px;
  width: 100%;
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
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <NotFoundPageContainer>
          <title>No Encontrado | MUY RICO GRUPO</title>
          <NotFoundTitle>{404}</NotFoundTitle>
          <NotFoundDescription>la página no fue encontrada</NotFoundDescription>
          <OfferActionButton href="/">Volver a la página principal</OfferActionButton>
        </NotFoundPageContainer>
      </body>
    </html>
  )
}
