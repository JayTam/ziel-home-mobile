import styled from "styled-components";
import React from "react";

const StyledTabBarItem = styled.div<TabBarItemProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: auto;
`;

interface Props {
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>;

type TabBarItemProps = Props & NativeAttrs;

const TabBarItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TabBarItemProps>>(
  (props, ref) => <StyledTabBarItem {...props} ref={ref} />
);

TabBarItem.displayName = "TabBarItem";

export default TabBarItem;
