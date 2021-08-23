import React from "react";
import styled from "styled-components";
import { ColorMixin, SizeMixin } from "./utils";
import { ClickableMixin } from "../mixins";

interface Props {
  color?: "primary" | "secondary" | "default";
  size?: "mini" | "small" | "medium" | "large";
  round?: boolean;
  block?: boolean;
}

const defaultProps: Props = {
  color: "default",
  size: "small",
  round: true,
};

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

export type ButtonProps = Props & NativeAttrs;

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  display: ${(props) => (props.block ? "block" : "inline-block")};
  width: ${(props) => (props.block ? "100%" : undefined)};
  box-sizing: border-box;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  border-radius: ${(props) => (props.round ? "1000px" : "6px")};
  transition: opacity 0.2s;
  -webkit-appearance: none;
  user-select: none;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  text-transform: capitalize;
  opacity: ${(props) => (props.disabled ? props.theme.palette.action?.disabledOpacity : undefined)};
  ${(props) => ColorMixin(props.color)}
  ${(props) => SizeMixin(props.size)}
  ${ClickableMixin}
`;

const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
  (props, ref) => {
    return <StyledButton {...props} ref={ref} />;
  }
);

Button.displayName = "Button";

Button.defaultProps = defaultProps;

export default Button;
