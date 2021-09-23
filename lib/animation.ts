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

export const FeedAnimationMix = (duration = 300) => css`
  &.feed-enter,
  &.feed-exit-done {
    opacity: 0;
  }
  &.feed-enter-active {
    opacity: 1;
    transition: opacity ${duration}ms;
  }
  &.feed-enter-done,
  &.feed-exit {
    opacity: 1;
  }
  &.feed-exit-active {
    opacity: 0;
    transition: opacity ${duration}ms;
  }
`;
