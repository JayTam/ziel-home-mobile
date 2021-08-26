import React, { createRef, useEffect, useState } from "react";
import styled from "styled-components";
import { parseTabList } from "./utils";
import { TabsProps } from "./interface";

interface TabsContextProps {
  activeKey?: string;
  isSecondary?: boolean;
}

export const TabsContext = React.createContext<TabsContextProps>({
  activeKey: "1",
  isSecondary: false,
});

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TabsList = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 14px;
  overflow: hidden;
`;
const StarTabsList = styled.div`
  position: relative;
  display: flex;
`;
const StarTabItem = styled.div<{ active: boolean; title?: string }>`
  font-weight: ${(props) => (props.active ? 500 : 400)};
  background-color: ${(props) =>
    props.active ? props.theme.palette.primary : props.theme.palette.default};
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  margin-right: 14px;
  white-space: nowrap;
  padding: 7px 10px;
  border-radius: 26px;

  &:last-of-type {
    margin: 0;
  }

  &::before {
    content: attr(title);
    font-weight: 500;
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 21px;
    right: -20px;
    width: 1px;
    height: 10px;
    background: #999 !important;
    z-index: 2;
  }
`;
const TabItem = styled.div<{ active: boolean; title?: string }>`
  font-weight: ${(props) => (props.active ? 500 : 400)};
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  margin-right: 30px;
  white-space: nowrap;
  padding: 12px 0;

  &:last-of-type {
    margin: 0;
  }

  &::before {
    content: attr(title);
    font-weight: 500;
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 21px;
    right: -20px;
    width: 1px;
    height: 10px;
    background: #999 !important;
    z-index: 2;
  }
`;

const TabPanelContainer = styled.div`
  display: block;
`;

const TabLinkBar = styled.span<{ left: number; width: number }>`
  position: absolute;
  display: inline-block;
  bottom: 0;
  left: ${(props) => props.left + "px"};
  width: ${(props) => props.width + "px"};
  height: 4px;
  background-color: ${(props) => props.theme.palette.primary};
  border-radius: 12px;
  transition: ${(props) =>
    props.left === 0 ? "none" : "left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)"};
`;

const Tabs: React.FC<TabsProps> = (props) => {
  const tabs = parseTabList(props.children);
  const arrLength = tabs.length;
  const tabRefs = React.useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [linkBarLeft, setLinkBarLeft] = useState(0);

  if (tabRefs.current.length !== arrLength) {
    // add or remove refs
    tabRefs.current = Array(arrLength)
      .fill(null)
      .map((_, i) => tabRefs.current[i] || createRef());
  }

  useEffect(() => {
    let startX = 0;
    const startRef = tabRefs.current[0];
    if (startRef?.current) {
      startX = startRef.current.getBoundingClientRect().x;
    }
    const currentIndex = tabs.findIndex((tab) => tab.indexKey === props.activeKey);
    if (currentIndex !== null) {
      const endRef = tabRefs.current[currentIndex];
      const clientRect = endRef?.current?.getBoundingClientRect();
      if (clientRect && props.barWidth) {
        setLinkBarLeft(clientRect.x - startX + clientRect.width / 2 - props.barWidth / 2);
      }
    }
  }, [props.activeKey, props.barWidth, tabs]);

  return (
    <TabsContext.Provider value={{ activeKey: props.activeKey, isSecondary: props.isSecondary }}>
      <Container>
        {props.isSecondary ? (
          <StarTabsList className={props.className}>
            {tabs.map((tab, i) => (
              <StarTabItem
                title={tab.tab}
                active={tab.indexKey === props.activeKey}
                ref={tabRefs.current[i]}
                key={tab.indexKey}
                onClick={() => props.onChange?.(tab.indexKey)}
              >
                {tab.tab}
              </StarTabItem>
            ))}
          </StarTabsList>
        ) : (
          <TabsList className={props.className}>
            {tabs.map((tab, i) => (
              <TabItem
                title={tab.tab}
                active={tab.indexKey === props.activeKey}
                ref={tabRefs.current[i]}
                key={tab.indexKey}
                onClick={() => props.onChange?.(tab.indexKey)}
              >
                {tab.tab}
              </TabItem>
            ))}
            <TabLinkBar left={linkBarLeft} width={props.barWidth ?? 14} />
          </TabsList>
        )}
        <TabPanelContainer>{props.children}</TabPanelContainer>
      </Container>
    </TabsContext.Provider>
  );
};

Tabs.defaultProps = {
  barWidth: 14,
};

export default Tabs;
