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

// install Virtual module
SwiperCore.use([Virtual]);

export interface PaperType {
  id: string;
  isPlay: boolean;
  poster: string;
  currentTime: number;
  touching: boolean;
  src: string;
}

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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [hiddenVideoPlayer, setHiddenVideoPlayer] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [papers, setPapers] = useState<PaperType[]>([
    {
      id: "001",
      isPlay: false,
      currentTime: 0,
      touching: false,
      poster: "https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF",
      src: "https://ziel-pp-public.oss-cn-hongkong.aliyuncs.com/community/1407540476060295168/d262278d-9d7d-4667-91b8-a87e7661315c.mp4?X_PP_Audience%3D1407540476060295168%26X_PP_ExpiredAt%3D1626662843%26X_PP_GrantedAt%3D1626662843%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1407540476060295168%2Fd262278d-9d7d-4667-91b8-a87e7661315c.mp4%26X_PP_Owner%3D1407540476060295168%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3Db4628d4021a36d245f0cafdb8a3eaffc",
    },
    {
      id: "002",
      isPlay: false,
      currentTime: 0,
      touching: false,
      poster: "https://t7.baidu.com/it/u=2529476510,3041785782&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1416312412643098624/64f5033b-cf7e-494e-bf77-89c8a409157c.mp4?X_PP_Audience%3D1415057901396000768%26X_PP_ExpiredAt%3D1627022676%26X_PP_GrantedAt%3D1627022676%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1415057901396000768%2F4bcd534b-cc57-4b75-ba28-82e3953f827f.mp4%26X_PP_Owner%3D1415057901396000768%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3D9012a9c99ac2649c289c0f752c037edb",
    },
    {
      id: "003",
      isPlay: false,
      currentTime: 0,
      touching: false,
      poster: "https://t7.baidu.com/it/u=727460147,2222092211&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1419494241059569664/59afd683-915c-452f-889d-bff810afeffe.mp4?X_PP_Audience%3D1419494241059569664%26X_PP_ExpiredAt%3D1627269130%26X_PP_GrantedAt%3D1627269130%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1419494241059569664%2F59afd683-915c-452f-889d-bff810afeffe.mp4%26X_PP_Owner%3D1419494241059569664%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3Dcc03eb95a65ea06a1f69fc5d4b4cc05b",
    },
    {
      id: "004",
      isPlay: false,
      currentTime: 0,
      touching: false,
      poster: "https://t7.baidu.com/it/u=2529476510,3041785782&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1416312412643098624/64f5033b-cf7e-494e-bf77-89c8a409157c.mp4?X_PP_Audience%3D1416312412643098624%26X_PP_ExpiredAt%3D1627626337%26X_PP_GrantedAt%3D1627626337%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1416312412643098624%2F64f5033b-cf7e-494e-bf77-89c8a409157c.mp4%26X_PP_Owner%3D1416312412643098624%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3D8c3d64210ce433538ff13c00305d6ab5",
    },
  ]);

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
}
