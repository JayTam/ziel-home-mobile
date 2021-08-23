import { GetServerSideProps, NextPage } from "next";
import { PaperType } from "../../apis/paper";
import { getProfileInfo, ProfileType } from "../../apis/profile";
import { getUserPapers } from "../../apis/paper";
import styled from "styled-components";
import TitleImg from "../../assets/imgs/profileBg.png";
import Image from "next/image";
import Button from "../../../lib/Button";
import { composeAuthHeaders, digitalScale } from "../../utils";
import Header from "../../components/Header";

interface ProfilePageProps {
  profile: ProfileType;
  papers: PaperType[];
}
const Profile: NextPage<ProfilePageProps> = (props) => {
  const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;
  const TopLayout = styled.div`
    width: 100%;
    height: 100%;
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
    width: 62px;
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
    background-color: ${(props) => props.theme.palette.background?.default};
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
  return (
    <Container>
      <Header>Profile</Header>
      <TopLayout>
        <TitleBg src={TitleImg} />
        <TopContent>
          <UserLayout>
            <UserIcon src={props.profile.avatar} />
            <UserRight>
              <UserName>{props.profile.nickname}</UserName>
              <FollowBtn color={"primary"}>Follow</FollowBtn>
            </UserRight>
          </UserLayout>
          <UserDecription>
            Difficult circumstances serve as a textbook of life for people.
          </UserDecription>
          <StatisticsLayout>
            <StatisticsItem>
              <Statistics>{digitalScale(props.profile.paperNum)}</Statistics>
              <TypeText>Papers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(props.profile.followerNum)}</Statistics>
              <TypeText>Followers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(props.profile.followingNum)}</Statistics>
              <TypeText>Follewing</TypeText>
            </StatisticsItem>
          </StatisticsLayout>
        </TopContent>
      </TopLayout>
    </Container>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const userId = params?.user_id as string;
  console.log(userId);

  // 用户简介信息
  const profileInfoResponse = await getProfileInfo(userId, { headers });
  const papersResponse = await getUserPapers({ userId, page: 1 }, { headers });

  return {
    props: {
      profile: profileInfoResponse.data.result,
      papers: papersResponse.data.result.data,
    },
  };
};
export default Profile;
