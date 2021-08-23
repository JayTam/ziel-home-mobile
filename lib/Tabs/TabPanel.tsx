import React, { useContext } from "react";
import { TabsContext } from "./index";
import styled from "styled-components";
import { TabPanelProps } from "./interface";

const Container = styled.div<{ open?: boolean }>`
  display: ${(props) => (props.open ? undefined : "none")};
  width: 100%;
`;

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const tabs = useContext(TabsContext);
  const open = props.indexKey === tabs.activeKey;

  if (props.forceRender)
    return open ? (
      <Container className={props.className} open={open}>
        {props.children}
      </Container>
    ) : null;

  return (
    <Container className={props.className} open={open}>
      {props.children}
    </Container>
  );
};

TabPanel.defaultProps = {
  forceRender: false,
};

export default TabPanel;
