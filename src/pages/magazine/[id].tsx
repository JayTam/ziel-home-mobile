import { GetServerSideProps, NextPage } from "next";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { MagazineType, getMagazineById, subscribeMagazine } from "@/apis";
import Header from "@/components/Header";
import { composeAuthHeaders, digitalScale, replaceToImgBaseUrl, useInfiniteScroll } from "@/utils";
import BtnShare from "@/assets/icons/btn_share.svg";
import ShowMoreText from "react-show-more-text";
import produce from "immer";
import PaperPreview from "@/components/Profiles/PaperPreview";
import { getPaperList, PaperType } from "@/apis/paper";
import SubscribeBtn from "@/assets/icons/subscribe.svg";
import UnSubscribeBtn from "@/assets/icons/unSubscribe.svg";
import { TextEllipsisMixin } from "#/lib/mixins";
import Head from "next/head";
import MorePopup from "@/components/MorePopup";
import ContributeIcon from "@/assets/icons/contribute.svg";
import Link from "next/link";
import FeedDialog from "@/components/feed/FeedDialog";
import { TFeedDialogContext, FeedDialogContext } from "@/components/feed/Feed";

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
  padding: 20px 20px 0 14px;
  width: 100%;
`;
const MagazineContent = styled.div`
  display: flex;
`;
const MagazineMask = styled.div`
  background-color: #eeeeee;
  height: 130px;
  width: 80px;
  min-width: 80px;
  max-width: 80px;
  position: absolute;
  top: 0;
  left: 5px;
  border-radius: 8px;
`;
const MagazineImgStyle = styled.div`
  position: relative;
  width: 90px;
  min-width: 90px;
  max-width: 90px;
  height: 120px;
`;
const MagazineImg = styled.img`
  box-shadow: 0px 2px 10px 0px #00000033;
  position: absolute;
  top: 5px;
  left: 0;
  border-radius: 14px;
  width: 90px;
  min-width: 90px;
  max-width: 90px;
  height: 120px;
`;
const MagazineInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0 0px 10px;
  width: 100%;
  margin-top: 6px;
`;
const TopContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  color: ${(props) => props.theme.palette.text?.primary};
  font-family: "DidotBold", serif;
  ${TextEllipsisMixin}
`;
const Statistics = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
  margin-top: 4px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const SplitDiv = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.palette.background?.paper};
  margin-top: 30px;
`;
const DescriptionTitle = styled.div`
  margin-top: 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
const Description = styled.div`
  margin-top: 4px;
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const BottomContent = styled.div`
  margin-top: 33px;
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
  min-width: 30px;
  max-width: 30px;
  height: 30px;
  border-radius: 50%;
`;
const AuthorName = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
  padding: 0 6px;
  width: 100px;
  ${TextEllipsisMixin}
`;
const MagazinePaperLayout = styled.div`
  margin-top: 6px;
  padding: 0 14px 14px 7px;
  height: 100%;
  width: 100%;
`;
const PaperContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 9px;
`;
const PaperItem = styled.div`
  width: calc((100vw - 35px) / 2);
  height: calc((100vw - 35px) / 2 / 0.56);
  margin-left: 7px;
  margin-top: 9px;
`;
const Contribute = styled.div`
  position: fixed;
  height: 50px;
  width: 225px;
  bottom: 40px;
  border-radius: 29px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.primary};
  span {
    margin-left: 10px;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }
`;
const Magazine: NextPage<MagazineProps> = ({ magazine }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [openFeed, setOpenFeed] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState<MagazineType | null>(magazine);
  const [currentPaper, setCurrentPaper] = useState<PaperType | null>(null);
  const [papers, setPapers] = useState<PaperType[]>([]);
  const { loaderRef, page, setLoading, setHasMore, hasMore } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 1,
  });

  const context: TFeedDialogContext = {
    papers,
    setPapers,
    currentPaper,
    setCurrentPaper,
  };

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
    setShareOpen(true);
  };
  const closePopup = () => {
    setShareOpen(false);
  };

  /**
   *  订阅杂志
   * @
   */
  const handleSubscribe = async (magazine: MagazineType | null) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setCurrentMagazine((prev) =>
      produce(prev, (draft) => {
        if (draft) {
          draft.isSubscribe = isSubscribe;
          if (isSubscribe) {
            draft.subscribeNum = magazine.subscribeNum + 1;
          } else {
            draft.subscribeNum = magazine.subscribeNum - 1;
          }
        }
        return draft;
      })
    );
  };

  const handleOpenFeed = (paper: PaperType | null) => {
    setCurrentPaper(paper);
    setOpenFeed(true);
  };

  const handleCloseFeed = () => {
    setCurrentPaper(null);
    setOpenFeed(false);
  };

  return (
    <>
      <Head>
        <title>{currentMagazine?.title}</title>
        <meta name="description" content={currentMagazine?.description} />
        <meta property="og:title" content={currentMagazine?.title} />
        <meta property="og:description" content={currentMagazine?.description} />
        {/* <meta property="og:image" content={currentMagazine?.cover} /> */}
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}magazine/${currentMagazine?.id}`}
        />
      </Head>
      <Container>
        <Header rightComponent={<BtnShare onClick={handleShare} />}>Magazine</Header>
        <Content>
          <MagazineContent>
            <MagazineImgStyle>
              <MagazineMask />
              <MagazineImg src={replaceToImgBaseUrl(currentMagazine?.cover)} />
            </MagazineImgStyle>
            <MagazineInfo>
              <TopContent>
                <Title>{currentMagazine?.title}</Title>
                <Statistics>
                  {digitalScale(magazine.paperNum)} stories &nbsp;&nbsp;&nbsp;
                  {digitalScale(magazine.subscribeNum)} subscribers
                </Statistics>
              </TopContent>
              <BottomContent>
                <AuthorContent>
                  <Avatar src={currentMagazine?.avatar} />
                  <AuthorName>{currentMagazine?.author}</AuthorName>
                </AuthorContent>
                <div onClick={() => handleSubscribe(currentMagazine)}>
                  {currentMagazine?.isSubscribe ? <SubscribeBtn /> : <UnSubscribeBtn />}
                </div>
              </BottomContent>
            </MagazineInfo>
          </MagazineContent>
          <SplitDiv />
          <DescriptionTitle>Description</DescriptionTitle>
          <Description>
            <ShowMoreText
              className="react-more-text"
              anchorClass="anchor"
              lines={2}
              more="More"
              less="Collect"
            >
              {currentMagazine?.description}
            </ShowMoreText>
          </Description>
        </Content>
        <MagazinePaperLayout>
          <PaperContent>
            {papers.map((paper) => (
              <PaperItem key={paper.id}>
                <PaperPreview
                  {...paper}
                  authorId={magazine.authorId}
                  dataSource="default"
                  onOpenFeed={() => handleOpenFeed(paper)}
                />
              </PaperItem>
            ))}
            {hasMore ? <div ref={loaderRef}>loading...</div> : null}
          </PaperContent>
        </MagazinePaperLayout>
        <Link href={`/paper/create?magazine_id=${magazine.id}`}>
          <Contribute>
            <ContributeIcon />
            <span>Contribute</span>{" "}
          </Contribute>
        </Link>
      </Container>
      <FeedDialogContext.Provider value={context}>
        <FeedDialog open={openFeed} type="default" onClose={handleCloseFeed} />
      </FeedDialogContext.Provider>
      <MorePopup open={shareOpen} moreType="magazine" magazine={magazine} onClose={closePopup} />
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
