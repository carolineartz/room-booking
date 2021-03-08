import "styled-components"
import { Theme } from "./config/theme"

declare module "styled-components" {
  export interface DefaultTheme extends Theme {
    background: string
  }
}
