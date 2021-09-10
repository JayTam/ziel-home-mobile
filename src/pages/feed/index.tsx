import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SwiperCore, { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Paper from "../../components/feed/Paper";
import { SwiperEvents } from "swiper/types";
import produce from "immer";
import VideoPlayer from "../../components/feed/VideoPlayer";
import { VideoReadyState } from "../../constants";
import { subscribeMagazine } from "../../apis";
import {
  getPaperList,
  getStarPapers,
  getUserPapers,
  getUserSubscribePapers,
  likePaper,
  PaperType,
  starPaper,
} from "../../apis/paper";
import { TextEllipsisMixin } from "../../../lib/mixins";
import { replaceToImgBaseUrl, useLogin } from "../../utils";
import { useAppSelector } from "../../app/hook";
import SubscribedIcon from "../../assets/icons/subscribed.svg";
import { followUser } from "../../apis/profile";
import Comments from "../../components/Comment/Comment";
import SubscribeButtonIcon from "../../assets/icons/subscribe-button.svg";
import FeedBackIcon from "../../assets/icons/feed-back.svg";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreOperate from "../../components/MoreOperate";
import Popup from "../../../lib/Popup";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { useUpdateEffect } from "ahooks";

// install Virtual module
SwiperCore.use([Virtual]);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #333;
`;

const StyledSwiper = styled(Swiper)`
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1000;
`;

const HeaderContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 70px;
  width: 100%;
  background: linear-gradient(180deg, #222 -7.14%, rgba(34, 34, 34, 0) 100%);
  z-index: 5;
  display: flex;
`;

const RouteBack = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RouteBackIcon = styled(FeedBackIcon)`
  margin: 0 14px;
`;

const MagazineContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px 16px 0;
  max-width: calc(100% - 48px);
  width: calc(100% - 48px);
  min-width: calc(100% - 48px);
`;

const MagazineInfo = styled.div`
  flex: 1;
  max-width: calc(100% - 54px);
  width: calc(100% - 54px);
  min-width: calc(100% - 54px);
`;

const MagazineTitle = styled.h1`
  color: ${(props) => props.theme.palette.common?.white};
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 6px;
  font-family: "DidotBold", serif;
  ${TextEllipsisMixin}
`;

const StyledSubscribedIcon = styled(SubscribedIcon)`
  margin-left: 7px;
`;

const MagazineNumber = styled.p`
  color: ${(props) => props.theme.palette.text?.hint};
  font-size: 12px;
  line-height: 14px;
  ${TextEllipsisMixin}
`;

const SharePopup = styled(Popup)`
  padding: 0;
  margin: 0;
  border-radius: 20px 20px 0 0;
`;

const MagazineSubscribeButton = styled(SubscribeButtonIcon)`
  //margin-right: 14px;
`;

type TType = "default" | "subscribe" | "user_paper" | "user_saved";

interface FeedProps {
  initalPapers: PaperType[];
}

const Feed: NextPage<FeedProps> = (props) => {
  const router = useRouter();
  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [papers, setPapers] = useState<PaperType[]>(props.initalPapers);
  const [currentPaper, setCurrentPaper] = useState<PaperType | null>(props.initalPapers[0] ?? null);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [swiperHeight, setSwiperHeight] = useState(0);
  const { withLogin } = useLogin();
  const [commentOpen, setCommentOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const player = videoPlayerRef.current;
    if (!player) return;

    const handleCloseLoading = () => {
      setVideoLoading(false);
    };
    if (player.readyState === VideoReadyState.HAVE_ENOUGH_DATA) {
      setVideoLoading(false);
    } else {
      setVideoLoading(true);
      player.addEventListener("loadeddata", handleCloseLoading);
    }
  }, [activeIndex]);

  useUpdateEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const type: TType = (router.query.type as TType) ?? "default";
        let response;
        switch (type) {
          case "subscribe":
            response = await getUserSubscribePapers({
              paperId: router.query["paper_id"] as string,
              page,
            });
            break;
          case "user_paper":
            response = await getUserPapers({
              userId: router.query["user"] as string,
              page,
            });
            break;
          case "user_saved":
            response = await getStarPapers({
              userId: router.query["user"] as string,
              page,
            });
            break;
          case "default":
          default:
            response = await getPaperList({
              magazineId: router.query["magazine_id"] as string,
              paperId: router.query["paper_id"] as string,
              page,
            });
            break;
        }
        const list = response.data.result.data;
        // const  = Boolean(response.data.result.hasmore);
        setPapers((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, router.query]);

  /**
   * 切换内容
   * 1. 播放状态，切换前后保持一直
   * 2. 播放进度，清零
   * @param swiper
   */
  const handleSwitchPaper: SwiperEvents["slideChangeTransitionEnd"] = (swiper) => {
    const prevActiveIndex = activeIndex;
    const currentActiveIndex = swiper.activeIndex;

    if (prevActiveIndex !== currentActiveIndex) {
      setActiveIndex(currentActiveIndex);
      setPapers((prev) =>
        produce(prev, (draft) => {
          draft[currentActiveIndex].isPlay = draft[prevActiveIndex]?.isPlay;
          draft[currentActiveIndex].currentTime = 0;
          draft[prevActiveIndex].isPlay = false;
          draft[prevActiveIndex].currentTime = 0;
          return draft;
        })
      );
    }
    setHiddenVideoPlayer(false);
    setPapers((prev) =>
      produce(prev, (draft) => {
        if (draft[swiper.activeIndex]) draft[swiper.activeIndex].touching = false;
        return draft;
      })
    );
  };

  const handleTogglePlay = (paper: PaperType) => {
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === paper.id) item.isPlay = !item.isPlay;
          else item.isPlay = false;
          return item;
        });
        return draft;
      })
    );
  };

  const handleChangeCurrentTime = (paper: PaperType, time: number) => {
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === paper.id) item.currentTime = time;
          return item;
        });
        return draft;
      })
    );
  };

  const handleTouchStart: SwiperEvents["touchStart"] = (swiper) => {
    setPapers((prev) =>
      produce(prev, (draft) => {
        if (draft[swiper.activeIndex]) draft[swiper.activeIndex].touching = true;
        return draft;
      })
    );
  };

  /**
   * 滑到最后一个paper，有两种情况
   * 1. 当前 magazine 还有更多 paper, 获取更多的 paper 进行追加
   * 2. 当前 magazine 没有更多 paper, 获取下一条 magazine，获取更多的 paper 进行追加，
   * 当切换为下一条 paper 时候，更新当前 magazine为下一条的
   */
  const handleReachEnd: SwiperEvents["reachEnd"] = () => {
    if (loading) return;
    setPage((prev) => prev + 1);
  };

  /**
   * 浏览器限制，video 要得到播放授权，需要在用户事件处理函数中执行video.play，不能在其他地方执行，会因丢失 user gesture token，导致无法播放
   * @param paper
   */
  const handleFirstPlay = (paper: PaperType) => {
    const player = videoPlayerRef.current;
    if (!player) return;
    player
      .play()
      .then(() => {
        // 播放当前 paper 中的 video
        setPapers((prev) =>
          produce(prev, (draft) => {
            draft.forEach((item) => {
              item.isPlay = item.id === paper.id;
              return item;
            });
            return draft;
          })
        );
      })
      .catch(() => {
        // 暂停所有 paper 中的 video
        setPapers((prev) =>
          produce(prev, (draft) => {
            draft.forEach((item) => {
              item.isPlay = false;
              return item;
            });
            return draft;
          })
        );
      });
  };

  const handleMoreOperate = (paper: PaperType) => {
    setCurrentPaper(paper);
    setMoreOpen(true);
  };

  useEffect(() => {
    // 因为浏览器底部工具栏的问题，等DOM渲染好出现工具栏之后，再设置Swiper的高度
    setTimeout(() => setSwiperHeight(window.innerHeight), 0);
    setTimeout(() => setSwiperHeight(window.innerHeight), 30);
    setTimeout(() => setSwiperHeight(window.innerHeight), 100);
  }, []);

  const user = useAppSelector((state) => state.user);

  /**
   * 订阅杂志
   */
  const handleSubscribe = withLogin<MouseEvent, PaperType | null>(async (event, paper) => {
    event?.stopPropagation();
    const magazine = paper?.magazine;
    if (!paper || !magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.id === paper.id && item.magazine) {
            item.magazine.isSubscribe = isSubscribe;
            if (isSubscribe) {
              item.magazine.subscribeNum = magazine.subscribeNum + 1;
            } else {
              item.magazine.subscribeNum = magazine.subscribeNum - 1;
            }
          }
        });
      })
    );
  });

  /**
   * 关注用户
   */
  const handleFollow = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    const isFollow = !paper.isFollow;
    await followUser(paper.authorId, isFollow);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.authorId === paper.authorId) item.isFollow = isFollow;
        });
        return draft;
      })
    );
  });

  /**
   * 点赞内容
   */
  const handleLikePaper = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    const isLike = !paper.isLike;
    await likePaper(paper.id, isLike);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.authorId === paper.authorId) item.isLike = isLike;
          if (isLike) item.likeNum = paper.likeNum + 1;
          else item.likeNum = paper.likeNum - 1;
        });
        return draft;
      })
    );
  });

  /**
   * 收藏内容
   */
  const handleStarPaper = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    const isStar = !paper.isStar;
    await starPaper(paper.id, isStar);
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item) => {
          if (item.authorId === paper.authorId) item.isStar = isStar;
          if (isStar) item.starNum = paper.starNum + 1;
          else item.starNum = paper.starNum - 1;
        });
        return draft;
      })
    );
  });

  /**
   * 评论内容
   */
  const handleCommentPaper = withLogin<PaperType>((paper) => {
    if (!paper) return;
    setCurrentPaper(paper);
    setCommentOpen(true);
  });

  /**
   * 关闭评论
   */
  const handleCommentClose = () => {
    setCommentOpen(false);
    setCurrentPaper(null);
  };

  /**
   * 关闭更多
   */
  const closeSharePopup = () => {
    setMoreOpen(false);
    setCurrentPaper(null);
  };

  return (
    <>
      <Head>
        <title>{currentPaper?.title}</title>
        <meta name="description" content={currentPaper?.description} />
        <meta property="og:title" content={currentPaper?.title} />
        <meta property="og:description" content={currentPaper?.description} />
        <meta property="og:image" content={replaceToImgBaseUrl(currentPaper?.poster)} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}feed?magazine_id=${currentPaper?.magazineId}&paper_id=${currentPaper?.id}`}
        />
      </Head>
      <Container>
        <StyledSwiper
          direction="vertical"
          virtual
          initialSlide={activeIndex}
          height={swiperHeight}
          onSliderFirstMove={handleTouchStart}
          onSlideResetTransitionEnd={handleSwitchPaper}
          onSlideChangeTransitionEnd={handleSwitchPaper}
          onReachEnd={handleReachEnd}
        >
          {papers.map((paper, index) => (
            <SwiperSlide key={paper.id} virtualIndex={index}>
              <HeaderContainer>
                <RouteBack onClick={() => router.back()}>
                  <RouteBackIcon />
                </RouteBack>
                <MagazineContainer>
                  <Link href={`/magazine/${paper.magazineId}`}>
                    <MagazineInfo>
                      <MagazineTitle>
                        {paper.magazine?.title}
                        {user.uid !== paper.magazine?.authorId && paper.magazine?.isSubscribe ? (
                          <StyledSubscribedIcon
                            onClick={(event: MouseEvent) => handleSubscribe(event, paper)}
                          />
                        ) : null}
                      </MagazineTitle>
                      <MagazineNumber>{paper.magazine?.subscribeNum} subscribers</MagazineNumber>
                    </MagazineInfo>
                  </Link>
                  {user.uid !== paper.magazine?.authorId && !paper.magazine?.isSubscribe ? (
                    <MagazineSubscribeButton
                      onClick={(event: MouseEvent) => handleSubscribe(event, paper)}
                    />
                  ) : null}
                </MagazineContainer>
              </HeaderContainer>
              <Paper
                {...paper}
                loading={videoLoading}
                active={activeIndex === index}
                onTogglePlay={() => handleTogglePlay(paper)}
                onFirstPlay={() => handleFirstPlay(paper)}
                onFollow={() => handleFollow(paper)}
                onLike={() => handleLikePaper(paper)}
                onStar={() => handleStarPaper(paper)}
                onMore={() => {
                  handleMoreOperate(paper);
                }}
                onComment={() => handleCommentPaper(paper)}
              />
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <VideoPlayer
          ref={videoPlayerRef}
          {...papers[activeIndex]}
          hidden={hiddenVideoPlayer}
          loading={videoLoading}
          onChangeCurrentTime={(time) => handleChangeCurrentTime(papers[activeIndex], time)}
        />
      </Container>
      {/* 评论组件 */}
      {currentPaper ? (
        <>
          <SharePopup position="bottom" onClickOverlay={closeSharePopup} open={moreOpen}>
            <MoreOperate onlyShare moreType="paper" paper={currentPaper} />
          </SharePopup>
          <Comments
            {...currentPaper}
            open={commentOpen}
            onCommentClose={() => handleCommentClose()}
            onClickOverlay={() => handleCommentClose()}
          />
        </>
      ) : null}
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
  const type: TType = (query.type as TType) ?? "default";
  let response;
  switch (type) {
    case "subscribe":
      response = await getUserSubscribePapers({
        paperId: query["paper_id"] as string,
        page: 1,
      });
      break;
    case "user_paper":
      response = await getUserPapers({
        userId: query["user"] as string,
        page: 1,
      });
      break;
    case "user_saved":
      response = await getStarPapers({
        userId: query["user"] as string,
        page: 1,
      });
      break;
    case "default":
    default:
      response = await getPaperList({
        magazineId: query["magazine_id"] as string,
        paperId: query["paper_id"] as string,
        page: 1,
      });
      break;
  }
  const list = response.data?.result?.data ?? [];

  res.setHeader("expires", "0");
  res.setHeader("cache-control", "no-cache");

  return {
    props: {
      initalPapers: list,
    },
  };
};
export default Feed;
