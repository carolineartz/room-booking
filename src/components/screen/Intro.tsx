import React from "react"
import { View } from "react-native"

import styled from "styled-components/native"

import { RootStackNavigationProps } from "@/components/navigation/RootStackNavigator"
import Button from "@/components/shared/Button"

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  overflow: scroll;
  background-color: ${({ theme }): string => theme.background};

  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`

type IntroProps = {
  navigation: RootStackNavigationProps<"Intro">
}

export const Intro = ({ navigation }: IntroProps) => {
  return (
    <Container>
      <View style={{ marginTop: 8 }} />
      <Button onPress={() => navigation.navigate("Bookings")} text="See Bookings" />
      <View style={{ marginTop: 8 }} />
    </Container>
  )
}
