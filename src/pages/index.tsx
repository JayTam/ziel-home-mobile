import BottomTabBar from "../components/BottomTabBar";
import Tabs from "../../lib/Tabs";
import TabPanel from "../../lib/Tabs/TabPanel";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  getMagazineList,
  getSubscribeMagazinePaperList,
  MagazineType,
  subscribeMagazine,
} from "../apis";
import MagazineCard from "../components/home/MagazineCard";
import produce from "immer";
import { useLogin } from "../utils";
import SubscribeMagazinePreview from "../components/home/SubscribeMagazinePreview";
import { useRouter } from "next/router";
import { withKeepAlive } from "react-next-keep-alive";

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

const ExploreContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 74px 0 50px 0;
`;

const SubscribeContainer = styled.div`
  padding: 74px 0 50px 0;
`;

const Home = () => {
  const router = useRouter();
  const [homeActiveTab, setHomeActiveTab] = useState("1");
  const [exploreMagazines, setExploreMagazines] = useState<MagazineType[]>([]);
  const [subscribedMagazines, setSubscribedMagazines] = useState<MagazineType[] | null>(null);

  const { withLogin } = useLogin();

  useEffect(() => {
    (async () => {
      if (homeActiveTab === "1") {
        const magazineResponse = await getMagazineList({ page: 1 });
        setExploreMagazines(magazineResponse.data.result.data);
      }
      if (homeActiveTab === "2") {
        const response = await getSubscribeMagazinePaperList({ page: 1 });
        setSubscribedMagazines(response.data.result.data);
      }
    })();
  }, [homeActiveTab]);

  /**
   * 订阅杂志
   */
  const handleSubscribe = withLogin<MagazineType>(async (magazine) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setExploreMagazines((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === magazine.id) {
            item.isSubscribe = isSubscribe;
            if (isSubscribe) {
              item.subscribeNum = magazine.subscribeNum + 1;
            } else {
              item.subscribeNum = magazine.subscribeNum - 1;
            }
          }
        });
        return draft;
      })
    );
  });

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
          <ExploreContainer>
            {exploreMagazines.map((magazine) => (
              <MagazineCard
                key={magazine.id}
                {...magazine}
                onSubscribe={() => handleSubscribe(magazine)}
                onClick={() => router.push(`/feed?magazine_id=${magazine.id}`)}
              />
            ))}
          </ExploreContainer>
        </TabPanel>
        <TabPanel tab="Subscribed" indexKey="2">
          <SubscribeContainer>
            {subscribedMagazines?.map((magazine) => (
              <SubscribeMagazinePreview key={magazine.id} {...magazine} />
            ))}
          </SubscribeContainer>
        </TabPanel>
      </HomeTabs>
      <BottomTabBar />
    </>
  );
};

export default withKeepAlive(Home, "index", { keepScrollEnabled: true });
