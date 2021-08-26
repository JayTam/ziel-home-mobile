import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { MagazineType, getMagazineById, subscribeMagazine } from "../../apis";
import Header from "../../components/Header";
import { composeAuthHeaders, digitalScale, useInfiniteScroll } from "../../utils";
import BtnShare from "../../assets/icons/btn_share.svg";
import ShowMoreText from "react-show-more-text";
import produce from "immer";
import PaperPreview from "../../components/Profiles/PaperPreview";
import { getPaperList, PaperType, topPaper } from "../../apis/paper";
import SubscribeBtn from "../../assets/icons/subscribe.svg";
import UnSubscribeBtn from "../../assets/icons/unSubscribe.svg";
import { TextEllipsisMixin } from "../../../lib/mixins";
import { useAppSelector } from "../../app/hook";

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
  line-height: 21px;
  ${TextEllipsisMixin}
  color: ${(props) => props.theme.palette.text?.primary};
`;
const Statistics = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 16px;
  margin-top: 6px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const SplitDiv = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.palette.background?.paper};
  margin-top: 30px;
`;
const DescriptionStyle = styled.div`
  padding-top: 4px;
`;
const DescriptionTitle = styled.div`
  margin-top: 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
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
const MagazinePaperLayout = styled.div`
  margin-top: 12px;
  padding: 0px 14px 0px 7px;
  height: 100%;
  width: 100%;
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
  const user = useAppSelector((state) => state.user);
  const isShowTop = useMemo(() => user.uid === magazine.authorId, [user.uid, magazine.authorId]);
  const [paperCounts, setPaperCounts] = useState(0);
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
        setPaperCounts(response.data.result.count);
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

  /**
   *  订阅杂志
   * @
   */
  const handleSubscribe = async (magazine: MagazineType) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setCurrentMagazin((prev) =>
      produce(prev, (draft) => {
        draft.isSubscribe = isSubscribe;
        if (isSubscribe) {
          draft.subscribeNum = magazine.subscribeNum + 1;
        } else {
          draft.subscribeNum = magazine.subscribeNum - 1;
        }
        return draft;
      })
    );
  };

  /**
   *  置顶内容
   * @
   */
  const handleTopPaper = async (paper: PaperType) => {
    if (!paper) return;
    const isTop = !paper.isTop;
    await topPaper(paper.id, magazine.id, isTop);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === paper.id) item.isTop = isTop;
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
                <Statistics>
                  {digitalScale(paperCounts)} storys &nbsp;&nbsp;&nbsp;
                  {digitalScale(magazine.subscribeNum)} subscribers
                </Statistics>
              </TopContent>
              <BottomContent>
                <AuthorContent>
                  <Avatar src={currentMagazine.avatar}></Avatar>
                  <AuthorName>{currentMagazine.author}</AuthorName>
                </AuthorContent>
                <div
                  onClick={() => {
                    handleSubscribe(currentMagazine);
                  }}
                >
                  {currentMagazine.isSubscribe ? <UnSubscribeBtn /> : <SubscribeBtn />}
                </div>
              </BottomContent>
            </MagazineInfo>
          </MagazineContent>
          <SplitDiv />
          <DescriptionStyle>
            <DescriptionTitle>Description</DescriptionTitle>
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
          </DescriptionStyle>
        </Content>
        <MagazinePaperLayout>
          <PaperContent>
            {papers.map((paper) => (
              <PaperItem key={paper.id}>
                <PaperPreview
                  {...paper}
                  authorId={magazine.authorId}
                  isShowTop={isShowTop}
                  onTop={() => handleTopPaper(paper)}
                ></PaperPreview>
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
