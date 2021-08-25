import { GetServerSideProps, NextPage } from "next";
import Header from "../../components/Header";
import styled from "styled-components";
import { composeAuthHeaders, digitalScale, useInfiniteScroll } from "../../utils";
import { getFollowers, getProfileInfo, ProfileType } from "../../apis/profile";
import Tabs from "../../../lib/Tabs";
import TabPanel from "../../../lib/Tabs/TabPanel";
import { useEffect, useMemo, useState } from "react";
import Button from "../../../lib/Button";

interface FollowersType {
  userId: string;
  profile: ProfileType;
  id: string;
  avatar: string;
  nickname: string;
  isFollow: boolean;
  defaultType: string;
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 14px;
  align-items: center;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
`;
const Name = styled.div`
  margin-left: 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`;
const FollowBtn = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
`;
const TabsStyle = styled(Tabs)`
  display: flex;
  justify-content: space-between;
  margin: 0 50px;
  width: calc(100% - 100px);
`;
const TabPanelStyle = styled(TabPanel)``;

const Followers: NextPage<FollowersType> = (props) => {
  const [type, setType] = useState<"1" | "2">("1");
  const [followers, setFollowers] = useState<FollowersType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 0,
  });
  const followType = useMemo(() => (type == "1" ? "followers" : "following"), [type]);
  const handleChange = (key: string) => {
    setType(key as "1" | "2");
    setFollowers([]);
  };
  useEffect(() => {
    setLoading(true);
    getFollowers({ userId: props.userId, type: followType, page })
      .then((response) => {
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setFollowers((prev) => [...prev, ...list]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [followType, page, props.userId, setHasMore, setLoading]);
  const handleFollow = (follower: FollowersType) => {
    if (!follower) return;
  };
  return (
    <>
      <Container>
        <Header>{props.profile.nickname}</Header>
        <TabsStyle activeKey={type} onChange={handleChange}>
          <TabPanelStyle indexKey="1" tab={`Followers ${digitalScale(props.profile.followerNum)}`}>
            {followers.map((follower) => (
              <ListItem key={follower.id}>
                <UserInfo>
                  <Avatar src={follower.avatar} />
                  <Name>{follower.nickname}</Name>
                </UserInfo>
                <FollowBtn
                  onClick={() => {
                    handleFollow(follower);
                  }}
                  color={follower.isFollow ? "secondary" : "primary"}
                >
                  {follower.isFollow ? "unFollow" : "Follow"}
                </FollowBtn>
              </ListItem>
            ))}
            {hasMore ? <div ref={loaderRef}>loading...</div> : null}
          </TabPanelStyle>
          <TabPanelStyle indexKey="2" tab={`Following ${digitalScale(props.profile.followingNum)}`}>
            {hasMore ? <div ref={loaderRef}>loading...</div> : null}
          </TabPanelStyle>
        </TabsStyle>
      </Container>
    </>
  );
};
export default Followers;

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const userId = params?.user_id as string;

  // 用户简介信息
  const profileInfoResponse = await getProfileInfo(userId, { headers });

  return {
    props: {
      userId: userId,
      profile: profileInfoResponse.data.result,
    },
  };
};
