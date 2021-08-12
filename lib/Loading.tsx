import React from "react";
import styled, { keyframes } from "styled-components";

const Spinner = styled.div`
  position: relative;
  margin: auto;
  width: 40px;
  height: 40px;
`;

const skBounce = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
       transform: scale(1.0);
  }
`;

const DoubleBounce1 = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${(props) => props.theme.palette.primary};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${skBounce} 2s infinite ease-in-out;
`;

const DoubleBounce2 = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${(props) => props.theme.palette.primary};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${skBounce} 2s -1s infinite ease-in-out;
`;

type LoadingProps = {
  className?: string;
  size?: string | number;
  hidden?: boolean;
  spacing?: number;
};

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  return (
    <Spinner
      className={props.className}
      hidden={props.hidden}
      ref={ref}
      style={{
        width: props.size,
        height: props.size,
        margin: `${props.spacing ?? 0}px auto`,
      }}
    >
      <DoubleBounce1 />
      <DoubleBounce2 />
    </Spinner>
  );
});

Loading.displayName = "Loading";

Loading.defaultProps = {
  size: 36,
  spacing: 0,
  hidden: false,
};

export default Loading;
