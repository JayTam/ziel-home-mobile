import { GetServerSideProps, NextPage } from "next";
import { getStarPapers, PaperType } from "../../apis/paper";
import { followUser, getProfileInfo, ProfileType } from "../../apis/profile";
import { getUserPapers } from "../../apis/paper";
import styled from "styled-components";
import TitleImg from "../../assets/imgs/profileBg.png";
import Image from "next/image";
import Button from "../../../lib/Button";
import { composeAuthHeaders, digitalScale } from "../../utils";
import Header from "../../components/Header";
import TabPanel from "../../../lib/Tabs/TabPanel";
import Tabs from "../../../lib/Tabs";
import { useMemo, useState } from "react";
import produce from "immer";
import { getStarMagazines, getUserMagazines, MagazineType } from "../../apis";
import PaperScrollList from "../../components/Profiles/PaperScrollList";
import MagazineScrollList from "../../components/Profiles/MagazineScrollList";
import { useAppSelector } from "../../app/hook";
import Edit from "../../assets/icons/edit.svg";

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
  favoriteMagezine: {
    data: MagazineType[];
    count: number;
  };
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TopLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
`;
const TitleBg = styled(Image)`
  height: 160px;
  width: 100vw;
`;
const TopContent = styled.div`
  padding: 0px 14px;
  z-index: 2;
  margin-top: -32px;
`;
const UserLayout = styled.div`
  display: flex;
`;
const UserIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
const UserRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  margin-left: 10px;
`;
const UserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
`;
const FollowBtn = styled(Button)`
  height: 30px;
`;
const UserDecription = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 16px;
  width: 100%;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const StatisticsLayout = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.palette.background?.paper};
  border-radius: 14px;
  height: 60px;
  width: 100%;
  margin-top: 30px;
`;
const StatisticsItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 13px 26px 14px 26px;
`;
const Statistics = styled.div`
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const TypeText = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const BottomLayout = styled.div`
  width: 100%;
`;

const TabsStyle = styled(Tabs)`
  width: calc(100% - 60px);
  display: flex;
  margin: 18px 30px 10px;
  justify-content: space-between;
`;
const TabsStarStyle = styled(Tabs)`
  display: flex;
`;
const TabPanelStyle = styled(TabPanel)`
  padding: 14px 14px 20px 7px;
`;
const Profile: NextPage<ProfilePageProps> = (props) => {
  const [type, setType] = useState<"1" | "2" | "3">("1");
  const [starType, setStarType] = useState<"1" | "2">("1");
  const [profile, setProfile] = useState<ProfileType>(props.profile);
  const user = useAppSelector((state) => state.user);
  const isMyProfile = useMemo(() => user.uid === props.userId, [props.userId, user.uid]);
  const handleChange = (key: string) => {
    setType(key as "1" | "2" | "3");
  };
  const handleStarChange = (key: string) => {
    setStarType(key as "1" | "2");
  };

  const handleFollow = async (profile: ProfileType) => {
    if (!profile) return;
    const isFollow = !profile.isFollow;
    await followUser(props.userId, isFollow);
    setProfile((prev) =>
      produce(prev, (draft) => {
        if (isFollow) {
          draft.followerNum -= 1;
        } else {
          draft.followerNum += 1;
        }
        draft.isFollow = isFollow;
      })
    );
  };
  return (
    <Container>
      <Header fixed>Profile</Header>
      <TopLayout>
        <TitleBg src={TitleImg} />
        <TopContent>
          <UserLayout>
            <UserIcon src={profile.avatar} />
            <UserRight>
              <UserName>{profile.nickname}</UserName>
              {isMyProfile ? (
                <Edit />
              ) : (
                <FollowBtn
                  onClick={() => {
                    handleFollow(profile);
                  }}
                  color={profile.isFollow ? "secondary" : "primary"}
                >
                  {profile.isFollow ? "unFollow" : "Follow"}
                </FollowBtn>
              )}
            </UserRight>
          </UserLayout>
          <UserDecription>{profile.signature}</UserDecription>
          <StatisticsLayout>
            <StatisticsItem>
              <Statistics>{digitalScale(profile.paperNum)}</Statistics>
              <TypeText>Papers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(profile.followerNum)}</Statistics>
              <TypeText>Followers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(profile.followingNum)}</Statistics>
              <TypeText>Follewing</TypeText>
            </StatisticsItem>
          </StatisticsLayout>
        </TopContent>
      </TopLayout>
      <BottomLayout>
        <TabsStyle activeKey={type} onChange={handleChange}>
          <TabPanelStyle
            indexKey="1"
            tab={`Paper ${digitalScale(props.usersPapers.count, "Int")}`}
            forceRender
          >
            <PaperScrollList userId={props.userId} />
          </TabPanelStyle>
          <TabPanelStyle
            indexKey="2"
            tab={`Magazine ${digitalScale(props.userMagazine.count, "Int")}`}
            forceRender
          >
            <MagazineScrollList userId={props.userId} />
          </TabPanelStyle>
          <TabPanelStyle
            indexKey="3"
            tab={`Saved ${digitalScale(
              props.favoriteMagezine.count + props.favoritePaper.count,
              "Int"
            )}`}
            forceRender
          >
            <TabsStarStyle isSecondary activeKey={starType} onChange={handleStarChange}>
              <TabPanelStyle indexKey="1" tab="Paper" forceRender>
                <PaperScrollList isStar userId={props.userId} />
              </TabPanelStyle>
              <TabPanelStyle indexKey="2" tab="Magazine" forceRender>
                <MagazineScrollList isStar userId={props.userId} />
              </TabPanelStyle>
            </TabsStarStyle>
          </TabPanelStyle>
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
      favoriteMagezine: userPaperResponse.data.result,
      favoritePaper: userMagazineResponse.data.result,
    },
  };
};
export default Profile;
