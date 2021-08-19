import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { useState } from "react";
import { MagazineType, getMagazineById } from "../../apis";
import { getPaperList } from "../../apis/paper";
import { PaperType } from "../../apis/paper";
import Header from "../../components/Header";
import { composeAuthHeaders } from "../../utils";
import BtnShare from "../../assets/icons/btn_share.svg";
import ShowMoreText from "react-show-more-text";
import Chief from "../../assets/icons/CHIEF.svg";
import Button from "../../../lib/Button";
import produce from "immer";

interface MagazineProps {
  magazine: MagazineType;
  paperList: PaperType[];
}

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Content = styled.div`
  padding: 20px 14px 0px 14px;
`;
const MagazineContent = styled.div`
  display: flex;
`;
const MagazineInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 14px;
  padding: 4px 0px;
`;
const TopContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const Description = styled.div`
  max-height: 32px;
  width: 100%;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const AuthorContent = styled.div`
  align-items: center;
  display: flex;
`;
const AuthorName = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-left: 6px;
`;
const ChiefDiv = styled.div`
  margin-left: 2px;
`;
const SubscribeButton = styled(Button)`
  width: 83px;
  height: 30px;
  border-radius: 26px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const UnSubscribeButton = styled(Button)`
  width: 99px;
  height: 30px;
  border-radius: 26px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const MagazineStatistics = styled.div`
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
const Magazine: NextPage<MagazineProps> = ({ magazine }) => {
  const [currentMagazine, setCurrentMagazin] = useState(magazine);
  const handleShare = () => {
    console.log("share!");
  };
  const fixedFloat = (num: string) => {
    const numArr = parseFloat(num).toString().split(".");
    const numInt = numArr[0];
    const numDec = numArr[1];

    return `${numInt}.${numDec ? numDec.substr(0, 1) : "0"}`;
  };
  const parseNum = (num: number) => {
    let newNum = "";
    if (num > 1e3 && num < 1e6) {
      newNum = `${fixedFloat((num / 1e3).toString())}K`;
    } else if (num >= 1e6) {
      newNum = `${fixedFloat((num / 1e6).toString())}M`;
    } else {
      newNum = num.toString();
    }
    return newNum;
  };
  const handleSubscribe = (data: MagazineType) => {
    const isSubscribe = !data.isSubscribe;
    setCurrentMagazin((prev) =>
      produce(prev, (draft) => {
        if (isSubscribe) {
          draft.subscribeNum -= 1;
        } else {
          draft.subscribeNum += 1;
        }
        draft.isSubscribe = isSubscribe;
      })
    );
  };
  return (
    <>
      <Container>
        <Header rightComponent={<BtnShare onClick={handleShare} />}>Magazine</Header>
        <Content>
          <MagazineContent>
            <img
              style={{ borderRadius: "14px" }}
              width={90}
              height={120}
              src={currentMagazine.cover}
            ></img>
            <MagazineInfo>
              <TopContent>
                <Title>{currentMagazine.title}</Title>
                <Description>
                  <ShowMoreText
                    className="react-more-text"
                    anchorClass="anchor"
                    lines={2}
                    more="More"
                    less="Collect"
                  >
                    {currentMagazine.description}
                  </ShowMoreText>
                </Description>
              </TopContent>
              <BottomContent>
                <AuthorContent>
                  <img
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                    src={currentMagazine.avatar}
                  ></img>
                  <AuthorName>{currentMagazine.author}</AuthorName>
                  <ChiefDiv>
                    <Chief></Chief>
                  </ChiefDiv>
                </AuthorContent>
                <div
                  onClick={() => {
                    handleSubscribe(currentMagazine);
                  }}
                >
                  {currentMagazine.isSubscribe ? (
                    <SubscribeButton color="primary">Subscribe</SubscribeButton>
                  ) : (
                    <UnSubscribeButton color="secondary">UnSubscribe</UnSubscribeButton>
                  )}
                </div>
              </BottomContent>
            </MagazineInfo>
          </MagazineContent>
          <MagazineStatistics>
            <StatisticsItem>
              <Statistics>{parseNum(currentMagazine.viewNum)}</Statistics>
              <TypeText>views</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{parseNum(currentMagazine.subscribeNum)}</Statistics>
              <TypeText>subscribers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{parseNum(currentMagazine.editorNum)}</Statistics>
              <TypeText>editors</TypeText>
            </StatisticsItem>
          </MagazineStatistics>
        </Content>
      </Container>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const magazineId = params?.id as string;
  const magazineResponse = await getMagazineById(magazineId, { headers });
  const paperParams = { magazineId: magazineId, page: 1 };
  const papersResponse = await getPaperList(paperParams, { headers });
  return {
    props: {
      papers: papersResponse.data.result.data,
      magazine: magazineResponse.data.result.data,
    },
  };
};
export default Magazine;
