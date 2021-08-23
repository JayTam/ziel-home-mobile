import React, { useContext } from "react";
import { TabsContext } from "./index";
import styled from "styled-components";
import { TabPanelProps } from "./interface";

const Container = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? undefined : "none")};
  width: 100%;
`;

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const tabs = useContext(TabsContext);
  const open = props.indexKey === tabs.activeKey;

  return (
    <Container className={props.className} open={open}>
      {props.children}
    </Container>
  );
};

export default TabPanel;
