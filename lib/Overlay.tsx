import React, { MouseEventHandler } from "react";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

interface OverlayProps {
  open: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  return (
    <OverlayContainer style={{ display: props.open ? undefined : "none" }} onClick={props.onClick}>
      {props.children}
    </OverlayContainer>
  );
};

export default Overlay;
