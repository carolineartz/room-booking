import React from "react"

import AppLoading from "expo-app-loading"

import RootNavigator from "@/components/navigation/RootStackNavigator"

import useCachedResources from "@/hooks/useCachedResources"
import RootProvider from "@/providers"

export const App = () => {
  const loaded = useCachedResources()

  if (!loaded) return <AppLoading />

  return (
    <RootProvider>
      <RootNavigator />
    </RootProvider>
  )
}
