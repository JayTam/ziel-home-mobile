import { css } from "styled-components";
import { ButtonProps } from "./index";

export const ColorMixin = (color?: ButtonProps["color"]) => css`
  background-color: ${(props) => {
    switch (color) {
      case "primary":
        return props.theme.palette.primary;
      case "secondary":
        return props.theme.palette.secondary;
      case "default":
      default:
        return props.theme.palette.default;
    }
  }};
  color: ${(props) => {
    switch (color) {
      case "primary":
        return props.theme.palette.text?.primary;
      case "secondary":
        return props.theme.palette.text?.primary;
      case "default":
      default:
        return props.theme.palette.text?.secondary;
    }
  }};
`;

export const SizeMixin = (size?: ButtonProps["size"]) => css`
  ${() => {
    switch (size) {
      case "mini":
        return "height: 24px; padding: 0 4px; font-size: 12px;";
      case "small":
        return "height: 32px; padding: 0 8px; font-size: 14px;";
      case "medium":
        return "height: 48px; padding: 0 15px; font-size: 16px;";
      case "large":
        return "width: 100%; height: 60px; font-size: 22px;";
    }
  }}
`;
