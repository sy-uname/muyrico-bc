'use client'

import { ThemeProvider } from '../ThemeProvider'
import { RedirectProviderProps } from './RedirectProvider.types'

export const RedirectProvider = ({ children }: RedirectProviderProps) => {
  return <ThemeProvider>{children}</ThemeProvider>
}
