import BottomTabBar from "../components/BottomTabBar";
import Tabs from "../../lib/Tabs";
import TabPanel from "../../lib/Tabs/TabPanel";
import styled from "styled-components";
import React, { useState } from "react";
import { useLogin } from "../utils";
import { withKeepAlive } from "react-next-keep-alive";
import ExploreMagazineScrollList from "../components/home/ExploreMagazineScrollList";
import SubscribeMagazineScrollList from "../components/home/SubscribeMagazineScrollList";

const HomeTabs = styled(Tabs)`
  height: 44px;
  font-size: 18px;
  line-height: 21px;
  margin: 0;
`;
// 下个版本会用到
// const ExploreTabs = styled(Tabs)`
//   font-size: 16px;
//   line-height: 19px;
// `;

const Home = () => {
  const { withLogin } = useLogin();
  const [homeActiveTab, setHomeActiveTab] = useState("1");

  /**
   * 切换explore/subscribe标签选项卡
   */
  const handleChangeHomeTab = withLogin<string>((tabKey) => {
    if (tabKey) setHomeActiveTab(tabKey);
  });

  return (
    <>
      <HomeTabs activeKey={homeActiveTab} onChange={(val) => handleChangeHomeTab(val)} center fixed>
        <TabPanel tab="Explore" indexKey="1">
          <ExploreMagazineScrollList />
        </TabPanel>
        <TabPanel tab="Subscribed" indexKey="2">
          <SubscribeMagazineScrollList />
        </TabPanel>
      </HomeTabs>
      <BottomTabBar />
    </>
  );
};

export default withKeepAlive(Home, "index", { keepScrollEnabled: true });
