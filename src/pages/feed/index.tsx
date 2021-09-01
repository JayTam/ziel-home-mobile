import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import SwiperCore, { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Paper from "../../components/Paper/Paper";
import { SwiperEvents } from "swiper/types";
import produce from "immer";
import VideoPlayer from "../../components/Paper/VideoPlayer";
import { VideoReadyState } from "../../constants";
import { GetServerSideProps, NextPage } from "next";
import { getMagazineById, getNextMagazine, MagazineType, subscribeMagazine } from "../../apis";
import { getPaperList, likePaper, PaperType, starPaper } from "../../apis/paper";
import { useUpdateEffect } from "ahooks";
import { TextEllipsisMixin } from "../../../lib/mixins";
import { composeAuthHeaders, useLogin } from "../../utils";
import { useAppSelector } from "../../app/hook";
import SubscribedIcon from "../../assets/icons/subscribed.svg";
import { followUser } from "../../apis/profile";
import Comments from "../../components/Comments";
import SubscribeButtonIcon from "../../assets/icons/subscribe-button.svg";
import FeedBackIcon from "../../assets/icons/feed-back.svg";
import { useRouter } from "next/router";

// install Virtual module
SwiperCore.use([Virtual]);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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

const RouteBackIcon = styled(FeedBackIcon)`
  margin: 14px 0 0 14px;
`;

const MagazineContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px;
`;

const MagazineInfo = styled.div`
  flex: 1;
  overflow: hidden;
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

const MagazineSubscribeButton = styled(SubscribeButtonIcon)`
  margin-left: 14px;
`;

interface HomePageProps {
  magazine: MagazineType;
  paperList: PaperType[];
}

const Home: NextPage<HomePageProps> = ({ magazine, paperList }) => {
  const router = useRouter();
  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(
    parseInt(router.query.active_index as string) || 0
  );
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [papers, setPapers] = useState<PaperType[]>(paperList);
  const [currentMagazine, setCurrentMagazine] = useState(magazine);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);

  const [swiperHeight, setSwiperHeight] = useState(0);
  const { withLogin } = useLogin();
  const [open, setOpen] = useState(false);
  const [paperProp, setPaperProp] = useState<PaperType>(paperList[0]);

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

  /**
   * 切换杂志
   * 1. 播放状态，切换前后保持一直
   * 2. 播放进度，清零
   * @param swiper
   */
  const handleSwitchPaper: SwiperEvents["slideChangeTransitionEnd"] = (swiper) => {
    if (!activeIndex) return;
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

  useUpdateEffect(() => {
    (async () => {
      setLoading(true);
      try {
        console.log("currentMagazine.id", currentMagazine.id);
        const response = await getPaperList({ magazineId: currentMagazine.id, page });
        const list = response.data.result.data;
        // const  = Boolean(response.data.result.hasmore);
        if (list.length > 0) {
          setPapers((prev) => [...prev, ...list]);
        } else {
          const magazineResponse = await getNextMagazine(currentMagazine.id);
          const nextMagazine: MagazineType = magazineResponse.data.result.data;
          setCurrentMagazine(nextMagazine);
          setPage(1);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

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

  useEffect(() => {
    setSwiperHeight(window.innerHeight);
  }, []);

  const user = useAppSelector((state) => state.user);
  const isMyMagazine = useMemo(
    () => user.uid === currentMagazine.authorId,
    [currentMagazine.authorId, user.uid]
  );

  /**
   * 订阅杂志
   */
  const handleSubscribe = withLogin<MagazineType>(async (magazine) => {
    if (!magazine) return;
    const isSubscribe = !magazine.isSubscribe;
    await subscribeMagazine(magazine.id, isSubscribe);
    setCurrentMagazine((prev) =>
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
    setPaperProp(paper);
    setOpen(true);
  });

  /**
   * 关闭评论
   */
  const handleCommentClose = () => {
    setOpen(false);
  };

  return (
    <>
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
                <RouteBackIcon onClick={() => router.back()} />
                <MagazineContainer>
                  <MagazineInfo>
                    <MagazineTitle>
                      {currentMagazine.title}
                      {!isMyMagazine && currentMagazine.isSubscribe ? (
                        <StyledSubscribedIcon onClick={() => handleSubscribe(currentMagazine)} />
                      ) : null}
                    </MagazineTitle>
                    <MagazineNumber>{currentMagazine.subscribeNum} subscribers</MagazineNumber>
                  </MagazineInfo>
                  {!isMyMagazine && !currentMagazine.isSubscribe ? (
                    <MagazineSubscribeButton onClick={() => handleSubscribe(currentMagazine)} />
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
                onComment={() => {
                  handleCommentPaper(paper);
                }}
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
      <Comments
        onCommentClose={() => {
          handleCommentClose();
        }}
        onClickOverlay={() => {
          handleCommentClose();
        }}
        open={open}
        {...paperProp}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const magazineId = query["magazine_id"] as string;
  const headers = composeAuthHeaders(req.headers.cookie);

  const magazineResponse = magazineId
    ? await getMagazineById(magazineId, { headers })
    : await getNextMagazine(undefined, { headers });
  const magazine: MagazineType = magazineResponse.data.result.data;

  let paperList = [];
  if (magazine?.id) {
    const paperResponse = await getPaperList(
      { magazineId: magazine.id, page: 1, limit: 2 },
      { headers }
    );
    paperList = paperResponse.data.result.data;
  }

  return {
    props: {
      magazine,
      paperList,
    },
  };
};

export default Home;
