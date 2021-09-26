import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import Overlay from "./Overlay";
import CloseIcon from "../src/assets/icons/close.svg";
import { useLockBodyScroll } from "@/utils";
import { SlideAnimationMixin } from "#/lib/animation";

export interface PopupProps {
  open: boolean;
  className?: string;
  round?: boolean;
  forceRender?: boolean;
  lazyRender?: boolean;
  position?: "top" | "left" | "right" | "bottom";
  closeable?: boolean;
  onClickOverlay?: MouseEventHandler<HTMLDivElement>;
  onClose?: () => void;
}

type PopupContainerProps = Omit<PopupProps, "onClickOverlay" | "className" | "open">;

const animationDuration = 300;

const PopupContainer = styled.div<PopupContainerProps>`
  position: fixed;
  background-color: ${(props) => props.theme.palette.background?.default};
  padding: ${(props) => (props.closeable ? "50px 20px 20px 20px" : "20px")};
  border-radius: ${(props) => (props.round ? "14px 14px 0 0" : undefined)};
  z-index: 2000;
  ${(props) => {
    switch (props.position) {
      case "top":
      case "bottom":
        return {
          left: 0,
          right: 0,
        };
      case "left":
      case "right":
        return {
          top: 0,
          bottom: 0,
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  }};
  ${(props) => props.position && SlideAnimationMixin(props.position, animationDuration)}
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const Popup: React.FC<PopupProps> = (props) => {
  useLockBodyScroll(props.open);

  return (
    <>
      <Overlay open={props.open} onClick={props.onClickOverlay} />

      <CSSTransition
        classNames="slide"
        in={props.open}
        timeout={animationDuration}
        mountOnEnter={props.lazyRender}
        unmountOnExit={props.forceRender}
      >
        <PopupContainer
          className={props.className}
          position={props.position}
          round={props.round}
          closeable={props.closeable}
        >
          {props.closeable ? <StyledCloseIcon onClick={props.onClose} /> : null}
          {props.children}
        </PopupContainer>
      </CSSTransition>
    </>
  );
};

Popup.defaultProps = {
  lazyRender: true,
  forceRender: false,
};

export default Popup;
