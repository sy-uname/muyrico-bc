'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Countdown, ResponsiveImage } from '@core'
import { numberFormat } from '@helpers'
import { getBlEnv } from '@helpers'
import { LocaleSwitcher } from '@shared'
import aboutUs from '@assets/about-us.webp'
import facebook from '@assets/facebook.webp'
import googleMaps from '@assets/google-maps.webp'
import instagram from '@assets/instagram.webp'
import logo from '@assets/logo.png'
import phone from '@assets/phone.webp'
import price from '@assets/price.webp'
import telegram from '@assets/telegram.webp'
import waze from '@assets/waze.webp'
import whatsapp from '@assets/whatsapp.webp'

import {
  LinkButton,
  OfferTitle,
  OfferValue,
  ButtonTitle,
  LogoContainer,
  ButtonsSection,
  OfferContainer,
  HomePageHeading,
  ButtonsContainer,
  ContentContainer,
  HomePageContainer,
  OfferActionButton,
  ButtonsSectionTitile,
  LocaleSwitcherSection,
  ButtonsSectionButtonsContainer,
} from './HomePage.elements'

export const HomePage = () => {
  const t = useTranslations('Home')

  const isPromocionActive = getBlEnv('promocionActive')
  const [promoEndDate, setPromoEndDate] = useState(new Date(Date.now() + 5000))
  const [promocionActive, setPromocionActive] = useState(isPromocionActive)

  const webSiteLink = process.env.webSiteLink as string
  const aboutUsLink = webSiteLink + '/about-us'
  const pricesLink = webSiteLink + '/services-and-prices'
  const wazeLink =
    'https://ul.waze.com/ul?ll=9.92989795%2C-84.21623279&navigate=yes&zoom=17&utm_campaign=default&utm_medium=lm_share_location'
  const googleMapsLink = 'https://maps.app.goo.gl/r48sU6MwMVwKMtRHA'
  const phoneMain = '50670127582'
  const phoneLink = `tel:+${phoneMain}`
  const whatsappLink = `https://wa.me/${phoneMain}`
  const ourName = process.env.ourName as string
  const telegramLink = `https://t.me/${ourName}`
  const instagramLink = `https://www.instagram.com/${ourName}`
  const facebookLink = `https://www.facebook.com/${ourName}`

  useEffect(() => {
    setPromoEndDate(getPromoEndDate())
  }, [])

  const getPromoEndDate = () => {
    const actionDay = 15
    const actionHour = 18
    const now = new Date()
    const nowDay = now.getDate()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const endOfMonthDay = endOfMonth.getDate()
    const daysUntilNext =
      (nowDay > actionDay
        ? endOfMonthDay
        : nowDay < actionDay
          ? actionDay
          : now.getHours() < actionHour
            ? actionDay
            : endOfMonthDay) - nowDay
    const nextPromoDay = new Date(now)
    nextPromoDay.setDate(now.getDate() + daysUntilNext)
    nextPromoDay.setHours(actionHour, 0, 0, 0)
    return nextPromoDay
  }

  return (
    <HomePageContainer as="main">
      <HomePageHeading>{process.env.ourNameOut}</HomePageHeading>
      <LogoContainer href={webSiteLink} target="_blank" aria-label={t('website-link-label')}>
        <ResponsiveImage src={logo.src} />
      </LogoContainer>

      <ContentContainer>
        <LocaleSwitcherSection>
          <LocaleSwitcher />
        </LocaleSwitcherSection>

        <ButtonsContainer>
          {promocionActive && (
            <ButtonsSection>
              <ButtonsSectionTitile as="h2">🔥 {t('promo.title')} 🔥</ButtonsSectionTitile>

              <OfferContainer>
                <OfferTitle>{t('promo.text')}</OfferTitle>
                <OfferValue>{numberFormat(20000)} ₡</OfferValue>
                <OfferActionButton
                  href={`${whatsappLink}?text=${t('promo.action-link-text')}`}
                  target="_blank">
                  {t('promo.action-button')}
                </OfferActionButton>
              </OfferContainer>

              <Countdown end={promoEndDate} onEnd={() => setPromocionActive(false)} />
            </ButtonsSection>
          )}

          <ButtonsSection>
            <ButtonsSectionTitile as="h2">{t('location-contacts.title')}</ButtonsSectionTitile>
            <ButtonsSectionButtonsContainer>
              <LinkButton href={wazeLink} target="_blank">
                <Image src={waze.src} width={48} height={48} alt="" />
                <ButtonTitle>Waze</ButtonTitle>
              </LinkButton>

              <LinkButton href={googleMapsLink} target="_blank">
                <Image src={googleMaps.src} width={48} height={48} alt="" />
                <ButtonTitle>Google</ButtonTitle>
              </LinkButton>

              <LinkButton href={phoneLink} target="_blank">
                <Image src={phone.src} width={48} height={48} alt="" />
                <ButtonTitle>{t('location-contacts.phone')}</ButtonTitle>
              </LinkButton>

              <LinkButton href={whatsappLink} target="_blank">
                <Image src={whatsapp.src} width={48} height={48} alt="" />
                <ButtonTitle>WhatsApp</ButtonTitle>
              </LinkButton>

              <LinkButton href={telegramLink} target="_blank">
                <Image src={telegram.src} width={48} height={48} alt="" />
                <ButtonTitle>Telegram</ButtonTitle>
              </LinkButton>
            </ButtonsSectionButtonsContainer>
          </ButtonsSection>
          {/**
          <ButtonsSection>
            <ButtonsSectionTitile>{t('information.title')}</ButtonsSectionTitile>
            <ButtonsSectionButtonsContainer>
              {instagramLink && (
                <LinkButton href={aboutUsLink} target="_blank">
                  <Image src={aboutUs.src} width={48} height={48} alt="" />
                  <ButtonTitle>{t('information.about-us')}</ButtonTitle>
                </LinkButton>
              )}

              {facebookLink && (
                <LinkButton href={pricesLink} target="_blank">
                  <Image src={price.src} width={48} height={48} alt="" />
                  <ButtonTitle>{t('information.prices-and-services')}</ButtonTitle>
                </LinkButton>
              )}
            </ButtonsSectionButtonsContainer>
          </ButtonsSection>
**/}
          <ButtonsSection>
            <ButtonsSectionTitile as="h2">{t('social-networks.title')}</ButtonsSectionTitile>
            <ButtonsSectionButtonsContainer>
              {instagramLink && (
                <LinkButton href={instagramLink} target="_blank">
                  <Image src={instagram.src} width={48} height={48} alt="" />
                  <ButtonTitle>Instagram</ButtonTitle>
                </LinkButton>
              )}

              {facebookLink && (
                <LinkButton href={facebookLink} target="_blank">
                  <Image src={facebook.src} width={48} height={48} alt="" />
                  <ButtonTitle>Facebook</ButtonTitle>
                </LinkButton>
              )}
            </ButtonsSectionButtonsContainer>
          </ButtonsSection>
        </ButtonsContainer>
      </ContentContainer>
    </HomePageContainer>
  )
}
