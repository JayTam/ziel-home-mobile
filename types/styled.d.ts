import "styled-components";

interface TypeAction {
  active: string;
  hover: string;
  hoverOpacity: number;
  selected: string;
  selectedOpacity: number;
  disabled: string;
  disabledOpacity: number;
  disabledBackground: string;
  focus: string;
  focusOpacity: number;
  activatedOpacity: number;
}

interface CommonColors {
  black: string;
  white: string;
}

interface TypeText {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
  special: string;
}

interface TypeBackground {
  default: string;
  paper: string;
  comment: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      default?: string;
      primary?: string;
      secondary?: string;
      error?: string;
      warning?: string;
      info?: string;
      success?: string;
      common?: Partial<CommonColors>;
      text?: Partial<TypeText>;
      action?: Partial<TypeAction>;
      background?: Partial<TypeBackground>;
    };
  }
}
