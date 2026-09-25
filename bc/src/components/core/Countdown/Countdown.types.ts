export type CountdownProps = {
  end: Date
  onEnd?: () => void
}

export type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
