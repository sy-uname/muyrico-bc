import { CountdownState } from './Countdown.types'

export const calculateTimeLeft = (end: Date): CountdownState => {
  const difference = +new Date(end) - +new Date()

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }
}

export const isCountdownEnded = (timeLeft: CountdownState) => {
  return timeLeft.days < 1 && timeLeft.hours < 1 && timeLeft.minutes < 1 && timeLeft.seconds < 1
}
