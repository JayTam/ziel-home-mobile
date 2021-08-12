import styled from "styled-components";
import React from "react";

const StyledTabBar = styled.div<TabBarProps>`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.2);
`;

interface Props {
  size?: string;
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

type TabBarProps = Props & NativeAttrs;

const TabBar = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TabBarProps>>(
  (props, ref) => <StyledTabBar {...props} ref={ref} />
);

TabBar.displayName = "TabBar";

export default TabBar;
