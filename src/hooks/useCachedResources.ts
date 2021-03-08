/* eslint-disable unused-imports/no-unused-imports */
import React from "react"

import {
  useFonts,
  MPLUS1p_100Thin,
  MPLUS1p_300Light,
  MPLUS1p_400Regular,
  MPLUS1p_500Medium,
  MPLUS1p_700Bold,
  MPLUS1p_800ExtraBold,
  MPLUS1p_900Black,
} from "@expo-google-fonts/m-plus-1p"
import { Asset } from "expo-asset"

export default function useCachedResources() {
  const [loadingImages, setLoadingImages] = React.useState(true)

  const [fontsLoaded] = useFonts({
    MPLUS1p_100Thin,
    MPLUS1p_300Light,
    MPLUS1p_400Regular,
    MPLUS1p_500Medium,
    MPLUS1p_700Bold,
    MPLUS1p_800ExtraBold,
    MPLUS1p_900Black,
  })

  // have no assets yet but setting up for future.
  React.useEffect(() => {
    const loadAssetsAsync = async (): Promise<void> => {
      // await Asset.loadAsync(assets)
      setLoadingImages(false)
    }

    loadAssetsAsync()
  }, [])

  return fontsLoaded && !loadingImages
}
