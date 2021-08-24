import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { MagazineType, getMagazineById, subscribeMagazine } from "../../apis";
import Header from "../../components/Header";
import { composeAuthHeaders, digitalScale, useInfiniteScroll } from "../../utils";
import BtnShare from "../../assets/icons/btn_share.svg";
import ShowMoreText from "react-show-more-text";
import Chief from "../../assets/icons/CHIEF.svg";
import Button from "../../../lib/Button";
import produce from "immer";
import PaperPreview from "../../components/Profiles/PaperPreview";
import { getPaperList, likePaper, PaperType } from "../../apis/paper";

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
const MagazineImg = styled.img`
  border-radius: 14px;
  width: 90px;
  height: 120px;
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
const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
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
  height: 30px;
  border-radius: 26px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const MagazineStatistics = styled.div`
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
const MagazinePaperLayout = styled.div`
  margin-top: 30px;
  padding: 0px 14px 0px 7px;
  height: 100%;
  width: 100%;
`;
const PapaerCount = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
`;
const PaperContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 7px;
`;
const PaperItem = styled.div`
  width: calc((100vw - 35px) / 2);
  height: calc((100vw - 35px) / 2 / 0.56);
  margin-left: 7px;
  margin-top: 7px;
`;
const Magazine: NextPage<MagazineProps> = ({ magazine }) => {
  const [currentMagazine, setCurrentMagazin] = useState(magazine);
  const [papers, setPapers] = useState<PaperType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 0,
  });

  useEffect(() => {
    setLoading(true);
    getPaperList({ magazineId: magazine.id, page })
      .then((response) => {
        const list = response.data.result.data;
        const hasMore = Boolean(response.data.result.hasmore);
        setHasMore(hasMore);
        setPapers((prev) => [...prev, ...list]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [magazine.id, page, setHasMore, setLoading]);

  const handleShare = () => {
    console.log("share!");
  };
  const handleSubscribe = async (magazine: MagazineType) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
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
  const handleStarPaper = async (paper: PaperType) => {
    if (!paper) return;
    const isLike = !paper.isLike;
    await likePaper(paper.id, isLike);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === paper.id) item.isLike = isLike;
          if (isLike) item.likeNum += 1;
          else item.likeNum -= 1;
        });
        return draft;
      })
    );
  };
  return (
    <>
      <Container>
        <Header rightComponent={<BtnShare onClick={handleShare} />}>Magazine</Header>
        <Content>
          <MagazineContent>
            <MagazineImg src={currentMagazine.cover}></MagazineImg>
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
                  <Avatar src={currentMagazine.avatar}></Avatar>
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
                  <SubscribeButton color={currentMagazine.isSubscribe ? "primary" : "secondary"}>
                    {currentMagazine.isSubscribe ? "Subscribe" : "UnSubscribe"}
                  </SubscribeButton>
                </div>
              </BottomContent>
            </MagazineInfo>
          </MagazineContent>
          <MagazineStatistics>
            <StatisticsItem>
              <Statistics>{digitalScale(currentMagazine.viewNum)}</Statistics>
              <TypeText>views</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(currentMagazine.subscribeNum)}</Statistics>
              <TypeText>subscribers</TypeText>
            </StatisticsItem>
            <StatisticsItem>
              <Statistics>{digitalScale(currentMagazine.editorNum)}</Statistics>
              <TypeText>editors</TypeText>
            </StatisticsItem>
          </MagazineStatistics>
        </Content>
        <MagazinePaperLayout>
          <PapaerCount>Paper 1344</PapaerCount>
          <PaperContent>
            {papers.map((paper) => (
              <PaperItem key={paper.id}>
                <PaperPreview {...paper} onLike={() => handleStarPaper(paper)}></PaperPreview>
              </PaperItem>
            ))}
            {hasMore ? <div ref={loaderRef}>loading...</div> : null}
          </PaperContent>
        </MagazinePaperLayout>
      </Container>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const headers = composeAuthHeaders(req.headers.cookie);
  const magazineId = params?.id as string;
  const magazineResponse = await getMagazineById(magazineId, { headers });
  return {
    props: {
      magazine: magazineResponse.data.result.data,
    },
  };
};
export default Magazine;
