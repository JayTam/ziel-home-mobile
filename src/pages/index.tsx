import { useEffect, useRef, useState } from "react";
import TabBar from "../../lib/TabBar";
import TabBarItem from "../../lib/TabBarItem";
import CreateIcon from "../assets/icons/create.svg";
import HomeActiveIcon from "../assets/icons/home-active.svg";
import HomeIcon from "../assets/icons/home.svg";
import styled from "styled-components";
import SwiperCore, { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Paper from "../components/Paper/Paper";
import { SwiperEvents } from "swiper/types";
import produce from "immer";
import VideoPlayer from "../components/Paper/VideoPlayer";
import { VideoReadyState } from "../constants";
import { GetServerSideProps, NextPage } from "next";
import { getNextMagazine, MagazineType } from "../apis";
import { getPaperList, PaperParams, PaperType } from "../apis/paper";
import { useUpdateEffect } from "ahooks";

// install Virtual module
SwiperCore.use([Virtual]);

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const VideoArea = styled.div`
  height: 100%;
`;

const StyledSwiper = styled(Swiper)`
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1000;
`;

interface HomePageProps {
  magazine: MagazineType;
  paperList: PaperType[];
}

const Home: NextPage<HomePageProps> = ({ magazine, paperList }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [papers, setPapers] = useState<PaperType[]>(paperList);
  const [currentMagazine, setCurrentMagazine] = useState(magazine);
  const [paperParams, setPaperParams] = useState<PaperParams>({
    page: 2,
    limit: 2,
  });
  const [loading, setLoading] = useState(false);

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
    const prevActiveIndex = activeIndex;
    const currentActiveIndex = swiper.activeIndex;

    if (prevActiveIndex !== currentActiveIndex) {
      setActiveIndex(currentActiveIndex);
      setPapers((prev) =>
        produce(prev, (draft) => {
          draft[currentActiveIndex].isPlay = draft[prevActiveIndex].isPlay;
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
        draft[swiper.activeIndex].touching = false;
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
        draft[swiper.activeIndex].touching = true;
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
    setPaperParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  useUpdateEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await getPaperList(currentMagazine.id, paperParams);
        const list = response.data.result.data;
        // const hasMore = Boolean(response.data.result.hasmore);
        if (list.length > 0) {
          setPapers((prev) => [...prev, ...list]);
        } else {
          const magazineResponse = await getNextMagazine(currentMagazine.id);
          const nextMagazine: MagazineType = magazineResponse.data.result;
          setCurrentMagazine(nextMagazine);
          setPaperParams((prev) => ({ ...prev, page: 1 }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [paperParams]);

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

  return (
    <>
      <Container>
        <VideoArea ref={containerRef}>
          <StyledSwiper
            direction="vertical"
            virtual
            onSliderFirstMove={handleTouchStart}
            onSlideResetTransitionEnd={handleSwitchPaper}
            onSlideChangeTransitionEnd={handleSwitchPaper}
            onReachEnd={handleReachEnd}
          >
            {papers.map((paper, index) => (
              <SwiperSlide key={paper.id} virtualIndex={index}>
                <Paper
                  {...paper}
                  loading={videoLoading}
                  active={activeIndex === index}
                  onTogglePlay={() => handleTogglePlay(paper)}
                  onFirstPlay={() => handleFirstPlay(paper)}
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
        </VideoArea>

        <TabBar>
          <TabBarItem>
            <HomeActiveIcon />
          </TabBarItem>
          <TabBarItem>
            <CreateIcon style={{ position: "relative", bottom: -5 }} />
          </TabBarItem>
          <TabBarItem>
            <HomeIcon />
          </TabBarItem>
        </TabBar>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const magazineResponse = await getNextMagazine();
  const magazine: MagazineType = magazineResponse.data.result;

  let paperList = [];
  if (magazine?.id) {
    const paperResponse = await getPaperList(magazine.id, { page: 1, limit: 2 });
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
