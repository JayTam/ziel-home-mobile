import { css } from "styled-components";

export const SlideAnimationMixin = (
  direction: "top" | "left" | "right" | "bottom",
  duration = 300
) => css`
  &.slide-enter,
  &.slide-exit-done {
    ${direction}: -100%;
  }

  &.slide-enter-active {
    ${direction}: 0;
    transition: bottom ${duration}ms;
  }

  &.slide-enter-done,
  &.slide-exit {
    ${direction}: 0;
  }

  &.slide-exit-active {
    ${direction}: -100%;
    transition: bottom ${duration}ms;
  }
`;
