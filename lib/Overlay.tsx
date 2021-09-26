import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { FeedAnimationMix } from "#/lib/animation";
import { CSSTransition } from "react-transition-group";

const animationDuration = 300;
const OverlayContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  ${FeedAnimationMix(animationDuration)}
`;

interface OverlayProps {
  open: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  return (
    <CSSTransition
      in={props.open}
      classNames="feed"
      timeout={animationDuration}
      mountOnEnter
      unmountOnExit
    >
      <OverlayContainer onClick={props.onClick}>{props.children}</OverlayContainer>
    </CSSTransition>
  );
};

export default Overlay;
