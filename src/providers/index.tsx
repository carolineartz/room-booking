import React from "react"

import { ThemeProvider, ThemeType } from "./ThemeProvider"

interface Props {
  initialThemeType?: ThemeType
  children?: React.ReactElement
}

// Any additional providers go here
const RootProvider = ({ initialThemeType = ThemeType.LIGHT, children }: Props) => {
  return <ThemeProvider initialThemeType={initialThemeType}>{children}</ThemeProvider>
}

export default RootProvider
