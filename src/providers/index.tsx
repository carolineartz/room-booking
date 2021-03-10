import React from "react"

import { Provider } from "react-redux"

import { ThemeProvider, ThemeType } from "./ThemeProvider"

import { store } from "@/config/store"

type RootProviderProps = {
  initialThemeType?: ThemeType
  children?: React.ReactElement
}

// Any additional providers go here
const RootProvider = ({ initialThemeType = ThemeType.LIGHT, children }: RootProviderProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider initialThemeType={initialThemeType}>{children}</ThemeProvider>
    </Provider>
  )
}

export default RootProvider
