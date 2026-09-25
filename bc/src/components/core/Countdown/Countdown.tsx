'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

import {
  CountdownTitle,
  CountdownTimeBox,
  CountdownContainer,
  CountdownTimeBoxTitle,
  CountdownTimeBoxValue,
  CountdownTimeBoxContainer,
  CountdownTimeBoxValueContainer,
} from './Countdown.elements'
import { isCountdownEnded, calculateTimeLeft } from './Countdown.helpers'
import { CountdownProps, CountdownState } from './Countdown.types'

export const Countdown = ({ end, onEnd }: CountdownProps) => {
  const t = useTranslations('Countdown')

  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const handler = () => {
      const newTimeLeft = calculateTimeLeft(end)

      if (isCountdownEnded(newTimeLeft)) {
        clearInterval(timer)
        onEnd && onEnd()
      }

      setTimeLeft(newTimeLeft)
    }

    const timer = setInterval(() => {
      handler()
    }, 1000)

    handler()

    return () => clearInterval(timer)
  }, [onEnd, end])

  return (
    <CountdownContainer>
      <CountdownTitle>{t('title')}:</CountdownTitle>
      <CountdownTimeBoxContainer>
        <CountdownTimeBox>
          <CountdownTimeBoxValueContainer>
            <CountdownTimeBoxValue>{String(timeLeft.days).padStart(2, '0')}</CountdownTimeBoxValue>
          </CountdownTimeBoxValueContainer>
          <CountdownTimeBoxTitle>{t('days')}</CountdownTimeBoxTitle>
        </CountdownTimeBox>

        <CountdownTimeBox>
          <CountdownTimeBoxValueContainer>
            <CountdownTimeBoxValue>{String(timeLeft.hours).padStart(2, '0')}</CountdownTimeBoxValue>
          </CountdownTimeBoxValueContainer>
          <CountdownTimeBoxTitle>{t('hours')}</CountdownTimeBoxTitle>
        </CountdownTimeBox>

        <CountdownTimeBox>
          <CountdownTimeBoxValueContainer>
            <CountdownTimeBoxValue>
              {String(timeLeft.minutes).padStart(2, '0')}
            </CountdownTimeBoxValue>
          </CountdownTimeBoxValueContainer>
          <CountdownTimeBoxTitle>{t('minutes')}</CountdownTimeBoxTitle>
        </CountdownTimeBox>

        <CountdownTimeBox>
          <CountdownTimeBoxValueContainer>
            <CountdownTimeBoxValue>
              {String(timeLeft.seconds).padStart(2, '0')}
            </CountdownTimeBoxValue>
          </CountdownTimeBoxValueContainer>
          <CountdownTimeBoxTitle>{t('seconds')}</CountdownTimeBoxTitle>
        </CountdownTimeBox>
      </CountdownTimeBoxContainer>
    </CountdownContainer>
  )
}
