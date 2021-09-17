import { GetServerSideProps, NextPage } from "next";
import { getStarPapers, PaperType } from "@/apis/paper";
import { followUser, getProfileInfo, ProfileType } from "@/apis/profile";
import { getUserPapers } from "@/apis/paper";
import styled from "styled-components";
import { composeAuthHeaders, digitalScale, useLogin } from "@/utils";
import Header from "@/components/Header";
import TabPanel from "#/lib/Tabs/TabPanel";
import Tabs from "#/lib/Tabs";
import { useMemo, useState } from "react";
import produce from "immer";
import { getStarMagazines, getUserMagazines, MagazineType } from "@/apis";
import PaperScrollList from "@/components/Profiles/PaperScrollList";
import MagazineScrollList from "@/components/Profiles/MagazineScrollList";
import { useAppSelector } from "@/app/hook";
import Edit from "@/assets/icons/edit.svg";
import FollowedIcon from "@/assets/icons/Followed_profile.svg";
import UnFollowedIcon from "@/assets/icons/unFollowed_profile.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "#/lib/Image";

interface ProfilePageProps {
  profile: ProfileType;
  userId: string;
  usersPapers: {
    data: PaperType[];
    count: number;
  };
  userMagazine: {
    count: number;
    data: MagazineType[];
  };
  favoritePaper: {
    data: PaperType[];
    count: number;
  };
  favoriteMagazine: {
    data: MagazineType[];
    count: number;
  };
}
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const TopLayout = styled.div`
  margin-top: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const TopContent = styled.div`
  padding: 0 14px;
  z-index: 2;
`;
const UserLayout = styled.div`
  display: flex;
`;
const UserIcon = styled(Image)`
  width: 70px;
  height: 70px;
  min-width: 70px;
  max-width: 70px;
  border-radius: 50%;
`;
const UserRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;
const UserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
  padding-right: 10px;
`;
const UserDescription = styled.div`
  margin-top: 20px;
  font-size: 14px;
  font-weight: 300;
  line-height: 16px;
  width: 100%;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const StatisticsLayout = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.palette.background?.paper};
  border-radius: 14px;
  height: 81px;
  width: 100%;
  margin-top: 30px;
  align-items: center;
`;
const StatisticsItem = styled.div`
  text-align: center;
  display: flex;
  flex-grow: 0.5;
  flex-direction: column;
  justify-content: center;
  padding: 13px 26px 14px 26px;
`;
const Statistics = styled.div`
  font-family: "DidotBold", serif;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const StatisticsSplit = styled.div`
  width: 1px;
  height: 30px;
  background-color: ${(props) => props.theme.palette.common?.white}; ;
`;
const TypeText = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const BottomLayout = styled.div`
  width: 100%;
`;

const TabsStyle = styled(Tabs)`
  width: calc(100% - 60px);
  display: flex;
  margin: 18px 50px 14px;
  justify-content: space-between;
`;
const TabsStarStyle = styled(Tabs)`
  display: flex;
  width: 100%;
`;
const TabPanelStyle = styled(TabPanel)`
  padding: 0px 14px 20px 7px;
`;
const SavePanelStyle = styled(TabPanel)`
  padding: 0;
`;

const Profile: NextPage<ProfilePageProps> = (props) => {
  const router = useRouter();
  const [type, setType] = useState<"1" | "2" | "3">("1");
  const [starType, setStarType] = useState<"1" | "2">("1");
  const [profile, setProfile] = useState<ProfileType>(props.profile);
  const user = useAppSelector((state) => state.user);
  const isMyProfile = useMemo(() => user.uid === props.userId, [props.userId, user.uid]);
  const { withLogin } = useLogin();
  const handleChange = (key: string) => {
    setType(key as "1" | "2" | "3");
    if (key === "3") setStarType("1");
  };
  const handleStarChange = (key: string) => {
    setStarType(key as "1" | "2");
  };

  const handleFollow = withLogin<ProfileType>(async (profile) => {
    if (!profile) return;
    const isFollow = !profile.isFollow;
    if (!isFollow) {
      const alertResult = confirm("Are you sure you want to cancel the follow?");
      if (!alertResult) return;
    }
    await followUser(props.userId, isFollow);
    setProfile((prev) =>
      produce(prev, (draft) => {
        draft.isFollow = isFollow;
        if (isFollow) {
          draft.followerNum = profile.followerNum + 1;
        } else {
          draft.followerNum = profile.followerNum - 1;
        }
        return draft;
      })
    );
  });

  /**
   * 处理路由返回
   * 如果是从 /paper/create 跳转过来，返回逻辑是返回首页
   * 否则是浏览器的back逻辑
   */
  const handleBack = async () => {
    if (router.query.from === "/paper/create") {
      await router.push("/");
    } else {
      await router.back();
    }
  };

  return (
    <Container>
      <Header onBack={handleBack}>Profile</Header>
      <TopLayout>
        <TopContent>
          <UserLayout>
            <UserIcon width={70} height={70} blur fit="cover" src={profile.avatar} />
            <UserRight>
              <UserName>{profile.nickname}</UserName>
              {isMyProfile ? (
                <Edit
                  onClick={() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_PAASPORT_URL}/profiles`;
                  }}
                />
              ) : (
                <div
                  onClick={() => {
                    handleFollow(profile);
                  }}
                >
                  {profile.isFollow ? <FollowedIcon /> : <UnFollowedIcon />}
                </div>
              )}
            </UserRight>
          </UserLayout>
          <UserDescription>
            Difficult circumstances serve as a textbook of life for people.
          </UserDescription>
          <StatisticsLayout>
            <Link href={`/followers/${props.userId}?tabIndex=1`}>
              <StatisticsItem>
                <Statistics>{digitalScale(profile.followerNum)}</Statistics>
                <TypeText>Followers</TypeText>
              </StatisticsItem>
            </Link>
            <StatisticsSplit />
            <Link href={`/followers/${props.userId}?tabIndex=2`}>
              <StatisticsItem>
                <Statistics>{digitalScale(profile.followingNum)}</Statistics>
                <TypeText>Following</TypeText>
              </StatisticsItem>
            </Link>
          </StatisticsLayout>
        </TopContent>
      </TopLayout>
      <BottomLayout>
        <TabsStyle tabStyle="dot" activeKey={type} onChange={handleChange}>
          <TabPanelStyle indexKey="1" tab={`Paper ${digitalScale(props.usersPapers.count, "Int")}`}>
            <PaperScrollList userId={props.userId} dataSource="user_paper" />
          </TabPanelStyle>
          <TabPanelStyle
            indexKey="2"
            tab={`Magazine ${digitalScale(props.userMagazine.count, "Int")}`}
          >
            <MagazineScrollList userId={props.userId} />
          </TabPanelStyle>
          <SavePanelStyle
            indexKey="3"
            tab={`Saved ${digitalScale(
              props.favoriteMagazine.count + props.favoritePaper.count,
              "Int"
            )}`}
          >
            <TabsStarStyle activeKey={starType} onChange={handleStarChange} tabStyle="fullLine">
              <TabPanelStyle indexKey="1" tab="Paper">
                <PaperScrollList userId={props.userId} dataSource="user_saved" />
              </TabPanelStyle>
              <TabPanelStyle indexKey="2" tab="Magazine">
                <MagazineScrollList isStarContent userId={props.userId} />
              </TabPanelStyle>
            </TabsStarStyle>
          </SavePanelStyle>
        </TabsStyle>
      </BottomLayout>
    </Container>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const userId = params?.user_id as string;

  // 用户简介信息
  const profileInfoResponse = await getProfileInfo(userId, { headers });
  const papersResponse = await getUserPapers({ userId, page: 1 }, { headers });
  const magazineResponse = await getUserMagazines({ userId, limit: 1, page: 1 }, { headers });
  const userPaperResponse = await getStarPapers({ userId, limit: 1, page: 1 }, { headers });
  const userMagazineResponse = await getStarMagazines({ userId, limit: 1, page: 1 }, { headers });
  return {
    props: {
      userId: userId,
      profile: profileInfoResponse.data.result,
      usersPapers: papersResponse.data.result,
      userMagazine: magazineResponse.data.result,
      favoriteMagazine: userPaperResponse.data.result,
      favoritePaper: userMagazineResponse.data.result,
    },
  };
};
export default Profile;
