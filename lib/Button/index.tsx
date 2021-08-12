import React from "react";
import styled from "styled-components";
import { ColorMixin, SizeMixin } from "./utils";
import { ClickableMixin } from "../mixins";

interface Props {
  color?: "primary" | "secondary";
  size?: "mini" | "small" | "medium" | "large";
  round?: boolean;
}

const defaultProps: Props = {
  color: "primary",
  size: "small",
  round: true,
};

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

export type ButtonProps = Props & NativeAttrs;

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  display: inline-block;
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
