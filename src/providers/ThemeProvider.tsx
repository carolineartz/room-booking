import React, { useState } from "react"

import { DefaultTheme, ThemeProvider as OriginalThemeProvider } from "styled-components/native"

import { dark, light } from "@/config/theme"
import createCtx from "@/utils/createCtx"

interface Context {
  theme: DefaultTheme
  themeType: ThemeType
  changeThemeType: () => void
}

const [useCtx, Provider] = createCtx<Context>()

export enum ThemeType {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

const createTheme = (type = ThemeType.LIGHT): DefaultTheme => {
  switch (type) {
    case ThemeType.DARK:
      return dark
    case ThemeType.LIGHT:
    default:
      return light
  }
}

export const defaultThemeType: ThemeType = ThemeType.LIGHT

interface Props {
  children?: React.ReactNode
  initialThemeType?: ThemeType
}

function ThemeProvider({ children, initialThemeType = defaultThemeType }: Props): React.ReactElement {
  const [themeType, setThemeType] = useState(initialThemeType)

  const changeThemeType = (): void => {
    const newThemeType = themeType === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT

    setThemeType(newThemeType)
  }

  const theme = createTheme(themeType)

  return (
    <Provider
      value={{
        changeThemeType,
        themeType,
        theme,
      }}
    >
      <OriginalThemeProvider theme={theme}>{children}</OriginalThemeProvider>
    </Provider>
  )
}

export { useCtx as useThemeContext, ThemeProvider }
