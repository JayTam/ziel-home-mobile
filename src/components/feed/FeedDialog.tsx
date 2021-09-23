import React, { useEffect, useRef, useState } from "react";
import Popup from "#/lib/Popup";
import styled from "styled-components";
import SwiperCore, { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { digitalScale, toastSNSAxiosError, useLogin } from "@/utils";
import FeedPaper from "@/components/feed/FeedPaper";
import VideoPlayer from "@/components/feed/VideoPlayer";
import FeedBackIcon from "@/assets/icons/feed-back.svg";
import { TextEllipsisMixin } from "#/lib/mixins";
import SubscribedIcon from "@/assets/icons/subscribed.svg";
import SubscribeButtonIcon from "@/assets/icons/subscribe-button.svg";
import { useRouter } from "next/router";
import {
  deletePaper,
  getPaperList,
  getStarPapers,
  getUserPapers,
  getUserSubscribePapers,
  hiddenPaper,
  likePaper,
  PaperType,
  starPaper,
  topPaper,
} from "@/apis/paper";
import { useUpdateEffect } from "ahooks";
import { SwiperEvents } from "swiper/types";
import produce from "immer";
import { useAppSelector } from "@/app/hook";
import { MagazineType, subscribeMagazine } from "@/apis";
import { followUser } from "@/apis/profile";
import { TFeedType } from "@/pages/feed";
import MorePopup from "@/components/MorePopup";
import Comments from "@/components/Comment/Comment";
// install Virtual module
SwiperCore.use([Virtual]);

interface FeedDialogProps {
  open: boolean;
  magazineId?: string;
  userId?: string;
  paperId?: string;
  type?: TFeedType;
  onClose?: (magazine: MagazineType) => void;
}

const StyledPopup = styled(Popup)`
  padding: 0;
`;

const Container = styled.div`
  position: relative;
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
  transform: rotate(-90deg);
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
  margin-bottom: 4px;
  font-family: "DidotBold", serif;
  ${TextEllipsisMixin}
`;

const StyledSubscribedIcon = styled(SubscribedIcon)`
  margin-left: 7px;
`;

const MagazineNumber = styled.p`
  color: ${(props) => props.theme.palette.text?.hint};
  font-size: 14px;
  font-weight: 300;
  line-height: 16px;
  ${TextEllipsisMixin}
`;

const MagazineSubscribeButton = styled(SubscribeButtonIcon)`
  //margin-right: 14px;
`;

const FeedDialog: React.FC<FeedDialogProps> = (props) => {
  const router = useRouter();
  const { withLogin } = useLogin();
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [papers, setPapers] = useState<PaperType[]>([]);
  const [currentPaper, setCurrentPaper] = useState<PaperType | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [swiperHeight, setSwiperHeight] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [openMore, setOpenMore] = useState(false);

  useEffect(() => {
    setPage(1);
    setCurrentPaper(null);
    setPapers([]);
    setActiveIndex(0);
  }, [props.open]);

  useEffect(() => setCurrentPaper(papers[activeIndex] ?? null), [activeIndex, papers]);

  useUpdateEffect(() => {
    (async () => {
      if (!props.open) return;
      try {
        setLoading(true);
        const type: TFeedType = (props.type as TFeedType) ?? "default";
        let response;
        switch (type) {
          case "subscribe":
            response = await getUserSubscribePapers({
              paperId: props.paperId ?? "",
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
              magazineId: props.magazineId ?? "",
              paperId: currentPaper?.id,
              page,
            });
            break;
        }
        setHasMore(Boolean(response.data.result.hasmore));
        const list = response.data.result.data;
        setPapers((prev) => [...prev, ...list]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, router.query, props.open, props.magazineId, props.paperId]);

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
          if (draft[swiper.activeIndex]) draft[swiper.activeIndex].touching = false;
          draft[currentActiveIndex].isPlay = draft[prevActiveIndex]?.isPlay;
          draft[prevActiveIndex].isPlay = false;
          return draft;
        })
      );
    } else {
      setPapers((prev) =>
        produce(prev, (draft) => {
          if (draft[swiper.activeIndex]) draft[swiper.activeIndex].touching = false;
          return draft;
        })
      );
    }
    setHiddenVideoPlayer(false);
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

  const handleTouchStart: SwiperEvents["touchStart"] = (swiper) => {
    setPapers((prev) =>
      produce(prev, (draft) => {
        if (draft[swiper.activeIndex]) draft[swiper.activeIndex].touching = true;
        return draft;
      })
    );
  };

  /**
   * 滑到最后一个paper，切换到下一页
   */
  const handleReachEnd: SwiperEvents["reachEnd"] = (swiper) => {
    if (loading) return;
    // 由于是client render，刚打开时还没有数据，会触发 reachEnd 事件
    if (swiper.slides.length === 0) return;
    // 有更多才翻页
    if (hasMore) {
      setPage((prev) => prev + 1);
    } else {
      // TODO:需要一个toast, 提示没有更多内容了
    }
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
          if (item.magazineId === paper.magazineId && item.magazine) {
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
          if (item.id === paper.id) item.isFollow = isFollow;
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
          if (item.id === paper.id) {
            item.isLike = isLike;
            if (isLike) item.likeNum = paper.likeNum + 1;
            else item.likeNum = paper.likeNum - 1;
          }
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
          if (item.id === paper.id) {
            item.isStar = isStar;
            if (isStar) item.starNum = paper.starNum + 1;
            else item.starNum = paper.starNum - 1;
          }
        });
        return draft;
      })
    );
  });

  /**
   * 删除paper
   */
  const handleDeletePaper = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    if (!confirm("confirm deletion")) return;
    await deletePaper(paper.magazineId, paper.id);
    setPapers((prev) =>
      produce(prev, (draft) => {
        const index = draft.findIndex(({ id }) => paper.id === id);
        draft.splice(index, 1);
        return draft;
      })
    );
    closeMorePopup();
  });

  /**
   * 置顶paper
   */
  const handleTopPaper = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    const isTop = !paper.isTop;
    try {
      await topPaper(paper.id, paper.magazineId, isTop);
      // 只修改置顶状态，不修改顺序
      setPapers((prev) =>
        produce(prev, (draft) => {
          const index = draft.findIndex(({ id }) => paper.id === id);
          draft[index].isTop = isTop;
          return draft;
        })
      );
      closeMorePopup();
    } catch (e) {
      toastSNSAxiosError(e);
    }
  });

  /**
   * 隐藏paper
   */
  const handleHiddenPaper = withLogin<PaperType>(async (paper) => {
    if (!paper) return;
    const isHidden = !paper.isHidden;
    try {
      await hiddenPaper(paper.magazineId, paper.id, isHidden);
      // 只修改状态，不修改顺序
      setPapers((prev) =>
        produce(prev, (draft) => {
          const index = draft.findIndex(({ id }) => paper.id === id);
          draft[index].isHidden = isHidden;
          return draft;
        })
      );
      closeMorePopup();
    } catch (e) {
      toastSNSAxiosError(e);
    }
  });

  // 打开评论
  const openCommentPopup = () => setCommentOpen(true);
  // 关闭评论
  const closeCommentPopup = () => setCommentOpen(false);
  // 打开更多
  const openMorePopup = () => {
    setOpenMore(true);
  };
  // 关闭更多
  const closeMorePopup = () => setOpenMore(false);

  return (
    <StyledPopup open={props.open} position="bottom" forceRender>
      <Container style={{ height: swiperHeight }}>
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
                <RouteBack onClick={() => paper.magazine && props.onClose?.(paper.magazine)}>
                  <RouteBackIcon />
                </RouteBack>
                <MagazineContainer>
                  <Link href={`/magazine/${paper.magazineId}`}>
                    <MagazineInfo>
                      <MagazineTitle>
                        {paper.magazine?.title}
                        {user.uid !== paper.magazine?.authorId && paper.magazine?.isSubscribe ? (
                          <StyledSubscribedIcon />
                        ) : null}
                      </MagazineTitle>
                      <MagazineNumber>
                        {digitalScale(paper.magazine?.subscribeNum)} subscribers
                      </MagazineNumber>
                    </MagazineInfo>
                  </Link>
                  {user.uid !== paper.magazine?.authorId && !paper.magazine?.isSubscribe ? (
                    <MagazineSubscribeButton
                      onClick={(event: MouseEvent) => handleSubscribe(event, paper)}
                    />
                  ) : null}
                </MagazineContainer>
              </HeaderContainer>
              <FeedPaper
                {...paper}
                loading={videoLoading}
                active={activeIndex === index}
                onTogglePlay={() => handleTogglePlay(paper)}
                onFirstPlay={() => handleFirstPlay(paper)}
                onFollow={() => handleFollow(paper)}
                onLike={() => handleLikePaper(paper)}
                onShare={openMorePopup}
                onMore={openMorePopup}
                onComment={openCommentPopup}
              />
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <VideoPlayer
          ref={videoPlayerRef}
          {...papers[activeIndex]}
          hidden={hiddenVideoPlayer}
          loading={videoLoading}
          onChangeLoading={(status) => setVideoLoading(status)}
        />
      </Container>
      {/* 更多弹框 */}
      {currentPaper ? (
        <MorePopup
          open={openMore}
          moreType="paper"
          paper={currentPaper}
          onClose={closeMorePopup}
          onDelete={() => handleDeletePaper(currentPaper)}
          onTop={() => handleTopPaper(currentPaper)}
          onHidden={() => handleHiddenPaper(currentPaper)}
          onStar={() => handleStarPaper(currentPaper)}
        />
      ) : null}
      {/* 评论组件 */}
      {currentPaper ? (
        <Comments
          {...currentPaper}
          open={commentOpen}
          onCommentClose={() => closeCommentPopup()}
          onClickOverlay={() => closeCommentPopup()}
        />
      ) : null}
    </StyledPopup>
  );
};

export default FeedDialog;
