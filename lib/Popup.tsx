import React from "react";
import styled from "styled-components";

interface PopupProps {
  show: boolean;
  position?: "top" | "left" | "right" | "bottom";
}

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const PopupContainer = styled.div`
  width: 100%;
`;

const Popup: React.FC<PopupProps> = (props) => {
  return (
    <>
      <Overlay style={{ display: props.show ? undefined : "none" }} />

      <PopupContainer style={{ display: props.show ? undefined : "none" }}>
        hello world
      </PopupContainer>
    </>
  );
};

export default Popup;
