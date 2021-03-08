import React from "react"

import { NavigationContainer } from "@react-navigation/native"
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack"

import { Bookings } from "@/components/screen/Bookings"
import { Intro } from "@/components/screen/Intro"

import { ThemeType, useThemeContext } from "@/providers/ThemeProvider"

export type RootStackParamList = {
  default: undefined
  Intro: undefined
  Bookings: undefined
}

export type RootStackNavigationProps<T extends keyof RootStackParamList = "default"> = StackNavigationProp<
  RootStackParamList,
  T
>

const Stack = createStackNavigator<RootStackParamList>()

function RootNavigator(): React.ReactElement {
  const { theme, themeType } = useThemeContext()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: { color: theme.fontColor },
          headerTintColor: theme.tintColor,
        }}
        headerMode={themeType === ThemeType.DARK ? "screen" : "float"}
      >
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Bookings" component={Bookings} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
