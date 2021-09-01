import { GetServerSideProps, NextPage } from "next";
import BottomTabBar from "../components/BottomTabBar";
import Tabs from "../../lib/Tabs";
import TabPanel from "../../lib/Tabs/TabPanel";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  getMagazineList,
  getSubscribeMagazinePaperList,
  MagazineType,
  subscribeMagazine,
} from "../apis";
import MagazineCard from "../components/home/MagazineCard";
import produce from "immer";
import { composeAuthHeaders, useLogin } from "../utils";
import SubscribeMagazinePreview from "../components/home/SubscribeMagazinePreview";

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

interface HomeProps {
  magazines: MagazineType[];
}

const Home: NextPage<HomeProps> = (props) => {
  const [homeActiveTab, setHomeActiveTab] = useState("1");
  const [exploreMagazines, setExploreMagazines] = useState(props.magazines);
  const [subscribedMagazines, setSubscribedMagazines] = useState<MagazineType[] | null>(null);

  const { withLogin } = useLogin();

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
  useEffect(() => {
    (async () => {
      if (subscribedMagazines === null && homeActiveTab === "2") {
        const response = await getSubscribeMagazinePaperList({ page: 1 });
        setSubscribedMagazines(response.data.result.data);
      }
    })();
  }, [homeActiveTab]);

  return (
    <>
      <HomeTabs activeKey={homeActiveTab} onChange={(val) => setHomeActiveTab(val)} center fixed>
        <TabPanel tab="Explore" indexKey="1">
          <ExploreContainer>
            {exploreMagazines.map((magazine) => (
              <MagazineCard
                key={magazine.id}
                {...magazine}
                onSubscribe={() => handleSubscribe(magazine)}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const response = await getMagazineList({ page: 1 }, { headers });
  const magazines = response.data.result.data;

  return {
    props: {
      magazines,
    },
  };
};

export default Home;
