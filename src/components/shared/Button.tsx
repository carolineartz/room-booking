import React from "react"
import {
  ActivityIndicator,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native"

import styled from "styled-components/native"

const StyledButton = styled.View`
  background-color: ${({ theme }): string => theme.btnPrimary};
  align-self: center;
  border-radius: 4px;
  border-width: 2px;
  width: 320px;
  height: 52px;
  border-color: ${({ theme }): string => theme.btnPrimary};

  align-items: center;
  justify-content: center;
`

const StyledButtonDisabled = styled(StyledButton)`
  background-color: ${({ theme }): string => theme.btnDisabled};
  border-color: rgb(200, 200, 200);
`

const StyledText = styled.Text`
  font-size: 24px;
  color: ${({ theme }): string => theme.btnPrimaryFont};
  font-family: MPLUS1p_400Regular;
`

const StyledTextDisabled = styled(StyledText)`
  color: ${({ theme }): string => theme.textDisabled};
`

const StyledImage = styled.Image`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 16px;
`

interface Props {
  testID?: string
  isLoading?: boolean
  isDisabled?: boolean
  onPress?: () => void
  style?: ViewStyle
  disabledStyle?: ViewStyle
  textStyle?: TextStyle
  imgLeftSrc?: ImageSourcePropType
  imgLeftStyle?: StyleProp<ImageStyle>
  indicatorColor?: string
  activeOpacity?: number
  text?: string
}

function Button(props: Props): React.ReactElement {
  if (props.isDisabled)
    return (
      <StyledButtonDisabled style={props.disabledStyle}>
        <StyledTextDisabled style={props.textStyle}>{props.text}</StyledTextDisabled>
      </StyledButtonDisabled>
    )

  if (props.isLoading)
    return (
      <StyledButton style={props.style}>
        <ActivityIndicator size="small" color={props.indicatorColor} />
      </StyledButton>
    )

  return (
    <TouchableOpacity testID={props.testID} activeOpacity={props.activeOpacity} onPress={props.onPress}>
      <StyledButton style={props.style}>
        {props.imgLeftSrc ? <StyledImage style={props.imgLeftStyle} source={props.imgLeftSrc} /> : null}
        <StyledText style={props.textStyle}>{props.text}</StyledText>
      </StyledButton>
    </TouchableOpacity>
  )
}

Button.defaultProps = {
  isLoading: false,
  isDisabled: false,
  indicatorColor: "white",
  activeOpacity: 0.5,
}

export default Button
