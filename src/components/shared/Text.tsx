import React from "react"
import { Text as RNText } from "react-native"

type TextProps = PropsOf<typeof RNText>

export const Text = ({
  weight = "regular",
  size = 16,
  children,
  color = "black",
  style,
  ...restProps
}: {
  weight?: "thin" | "light" | "regular" | "medium" | "bold" | "extra-bold" | "black"
  color?: string
  size?: number
  children: React.ReactNode
} & TextProps) => {
  const fontFamily = React.useMemo(() => {
    switch (weight) {
      case "thin":
        return "MPLUS1p_100Thin"
      case "light":
        return "MPLUS1p_300Light"
      case "regular":
        return "MPLUS1p_400Regular"
      case "medium":
        return "MPLUS1p_500Medium"
      case "bold":
        return "MPLUS1p_700Bold"
      case "extra-bold":
        return "MPLUS1p_800ExtraBold"
      case "black":
        return "MPLUS1p_900Black"
    }
  }, [weight])

  return (
    <RNText style={[{ fontFamily, fontSize: size, color }, style]} {...restProps}>
      {children}
    </RNText>
  )
}
