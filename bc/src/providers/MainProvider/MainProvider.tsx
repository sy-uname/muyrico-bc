'use client'

import { ThemeProvider } from '../ThemeProvider'
import { MainProviderProps } from './MainProvider.types'

export const MainProvider = ({ children }: MainProviderProps) => {
  return <ThemeProvider>{children}</ThemeProvider>
}
