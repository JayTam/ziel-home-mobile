import { GetServerSideProps, NextPage } from "next";
import Header from "@/components/Header";
import styled from "styled-components";
import { composeAuthHeaders, digitalScale, useInfiniteScroll, useLogin } from "@/utils";
import { followUser, getFollowers, getProfileInfo, ProfileType } from "@/apis/profile";
import Tabs from "#/lib/Tabs";
import TabPanel from "#/lib/Tabs/TabPanel";
import { useEffect, useMemo, useState } from "react";
import produce from "immer";
import { useAppSelector } from "@/app/hook";
import { useRouter } from "next/router";
import FollowedIcon from "@/assets/icons/Followed_profile.svg";
import UnFollowedIcon from "@/assets/icons/unFollowed_profile.svg";
import Loading from "#/lib/Loading";
import Empty from "#/lib/Empty";
import Image from "#/lib/Image";

interface FollowersType {
  profileInfo: ProfileType;
  id: string;
  avatar: string;
  nickname: string;
  isFollow: boolean;
  defaultType: string;
}
const Container = styled.div`
  width: 100%;
  height: 100%;
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
  padding-right: 10px;
`;
const Avatar = styled(Image)`
  height: 48px;
  width: 48px;
  min-width: 48px;
  max-width: 48px;
  border-radius: 50%;
`;
const Name = styled.div`
  margin-left: 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`;
const TabsStyle = styled(Tabs)`
  display: flex;
  justify-content: space-between;
  margin: 0 50px;
  width: calc(100% - 100px);
  z-index: 1;
`;
const TabPanelStyle = styled(TabPanel)``;

const Followers: NextPage<FollowersType> = ({ profileInfo }) => {
  const { withLogin } = useLogin();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [type, setType] = useState<"1" | "2">(router.query.tabIndex === "1" ? "1" : "2");
  const [profile, setProfile] = useState<ProfileType>(profileInfo);
  const [followers, setFollowers] = useState<FollowersType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore, setPage, loading } =
    useInfiniteScroll<HTMLDivElement>({
      hasMore: false,
      initialPage: 1,
    });
  const followType = useMemo(() => (type == "1" ? "followers" : "following"), [type]);
  const handleChange = (key: string) => {
    if (key === type) return;
    setType(key as "1" | "2");
    setFollowers([]);
    setPage(1);
    setLoading(true);
  };
  useEffect(() => {
    (() => {
      setLoading(true);
      getFollowers({ userId: profile.id, type: followType, page })
        .then((response) => {
          const list = response.data.result.data;
          const hasMore = Boolean(response.data.result.hasmore);
          setHasMore(hasMore);
          setFollowers((prev) => [...prev, ...list]);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, [followType, page, profile.id, setHasMore, setLoading]);

  const handleFollow = withLogin<FollowersType>(async (follower) => {
    if (!follower) return;
    const isFollow = !follower.isFollow;
    if (!isFollow) {
      const alertResult = confirm("Are you sure you want to unfollow?");
      if (!alertResult) return;
    }
    await followUser(follower.id, isFollow);
    setFollowers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === follower.id) item.isFollow = isFollow;
        });
        return draft;
      })
    );
    if (user.uid === profile.id) {
      setProfile((prev) =>
        produce(prev, (draft) => {
          if (isFollow) draft.followingNum = profile.followingNum + 1;
          else draft.followingNum = profile.followingNum - 1;
          return draft;
        })
      );
    }
  });
  return (
    <>
      <Container>
        <Header>Follow</Header>
        <TabsStyle activeKey={type} onChange={handleChange}>
          <TabPanelStyle
            indexKey="1"
            tab={`Followers ${digitalScale(profile.followerNum)}`}
            forceRender
          >
            {followers.length === 0 && !loading ? (
              <Empty description="No Followers" />
            ) : (
              followers.map((follower) => (
                <ListItem key={follower.id}>
                  <UserInfo>
                    <Avatar blur width={48} height={48} src={follower.avatar} />
                    <Name>{follower.nickname}</Name>
                  </UserInfo>
                  {user.uid === follower.id ? (
                    ""
                  ) : (
                    <div
                      onClick={() => {
                        handleFollow(follower);
                      }}
                    >
                      {follower.isFollow ? <FollowedIcon /> : <UnFollowedIcon />}
                    </div>
                  )}
                </ListItem>
              ))
            )}
            {hasMore ? <Loading ref={loaderRef} /> : null}
          </TabPanelStyle>
          <TabPanelStyle
            forceRender
            indexKey="2"
            tab={`Following ${digitalScale(profile.followingNum)}`}
          >
            {followers.length === 0 && !loading ? (
              <Empty description="No Followers" />
            ) : (
              followers.map((follower) => (
                <ListItem key={follower.id}>
                  <UserInfo>
                    <Avatar blur width={48} height={48} src={follower.avatar} />
                    <Name>{follower.nickname}</Name>
                  </UserInfo>
                  {user.uid === follower.id ? (
                    ""
                  ) : (
                    <div
                      onClick={() => {
                        handleFollow(follower);
                      }}
                    >
                      {follower.isFollow ? <FollowedIcon /> : <UnFollowedIcon />}
                    </div>
                  )}
                </ListItem>
              ))
            )}
            {hasMore ? <Loading ref={loaderRef} /> : null}
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
      profileInfo: profileInfoResponse.data.result,
    },
  };
};
