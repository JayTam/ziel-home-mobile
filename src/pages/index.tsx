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
import { getMagazineList, MagazineType } from "../apis";
import { getPaperList, PaperType } from "../apis/paper";

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
  magazineList: MagazineType[];
  paperList: PaperType[];
}

const Home: NextPage<HomePageProps> = ({ paperList }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [papers, setPapers] = useState<PaperType[]>(paperList);

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
  const magazineResponse = await getMagazineList({ page: 1 });
  const magazineList = magazineResponse.data.result.data;
  let paperList = [];

  if (magazineList.length > 0) {
    const paperResponse = await getPaperList(magazineList[0].id, { page: 1 });
    paperList = paperResponse.data.result.data;
  }

  return {
    props: {
      magazineList,
      paperList,
    },
  };
};

export default Home;
