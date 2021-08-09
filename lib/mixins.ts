import { css } from "styled-components";

export const ClickableMixin = css`
  position: relative;

  &::before {
    position: absolute;
    top: 50%;
    content: "";
    left: 50%;
    width: 100%;
    height: 100%;
    background-color: #000;
    border-radius: inherit;
    transform: translate(-50%, -50%);
    opacity: 0;
  }

  &:active::before {
    opacity: 0.1;
  }
`;
