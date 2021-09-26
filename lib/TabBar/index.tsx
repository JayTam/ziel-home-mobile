import styled from "styled-components";
import React from "react";

const StyledTabBar = styled.div<TabBarProps>`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 50px;
  background-color: #222;
`;

interface Props {
  size?: string;
  dark?: boolean;
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

type TabBarProps = Props & NativeAttrs;

const TabBar = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TabBarProps>>(
  (props, ref) => (
    <StyledTabBar style={{ backgroundColor: props.dark ? "#222" : "#fff" }} {...props} ref={ref} />
  )
);

TabBar.displayName = "TabBar";

export default TabBar;
