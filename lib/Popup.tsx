import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import Overlay from "./Overlay";
import CloseIcon from "../src/assets/icons/close.svg";
import { useLockBodyScroll } from "../src/utils";

interface PopupProps {
  open: boolean;
  className?: string;
  round?: boolean;
  position?: "top" | "left" | "right" | "bottom";
  closeable?: boolean;
  onClickOverlay?: MouseEventHandler<HTMLDivElement>;
  onClose?: () => void;
}

const PopupContainer = styled.div<Omit<PopupProps, "onClickOverlay" | "className">>`
  position: fixed;
  display: ${(props) => (props.open ? undefined : "none")};
  background-color: ${(props) => props.theme.palette.background?.default};
  padding: ${(props) => (props.closeable ? "50px 20px 20px 20px" : "20px")};
  border-radius: ${(props) => (props.round ? "14px 14px 0 0" : undefined)};
  z-index: 2000;
  ${(props) => {
    switch (props.position) {
      case "top":
        return {
          top: 0,
          left: 0,
          right: 0,
        };
      case "bottom":
        return {
          bottom: 0,
          left: 0,
          right: 0,
        };
      case "left":
        return {
          left: 0,
          top: 0,
          bottom: 0,
        };
      case "right":
        return {
          right: 0,
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

      <PopupContainer
        className={props.className}
        style={{ display: props.open ? undefined : "none" }}
        open={props.open}
        position={props.position}
        round={props.round}
        closeable={props.closeable}
      >
        {props.closeable ? <StyledCloseIcon onClick={props.onClose} /> : null}
        {props.children}
      </PopupContainer>
    </>
  );
};

export default Popup;
