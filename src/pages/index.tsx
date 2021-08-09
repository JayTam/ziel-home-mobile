import { useRef, useState } from "react";
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

// install Virtual module
SwiperCore.use([Virtual]);

export interface PaperType {
  id: string;
  isPlay: boolean;
  poster: string;
  currentTime: number;
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
  height: 100%;
  width: 100%;
`;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [papers, setPapers] = useState<PaperType[]>([
    {
      id: "001",
      isPlay: false,
      currentTime: 0,
      poster: "https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF",
      src: "https://ziel-pp-public.oss-cn-hongkong.aliyuncs.com/community/1407540476060295168/d262278d-9d7d-4667-91b8-a87e7661315c.mp4?X_PP_Audience%3D1407540476060295168%26X_PP_ExpiredAt%3D1626662843%26X_PP_GrantedAt%3D1626662843%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1407540476060295168%2Fd262278d-9d7d-4667-91b8-a87e7661315c.mp4%26X_PP_Owner%3D1407540476060295168%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3Db4628d4021a36d245f0cafdb8a3eaffc",
    },
    {
      id: "002",
      isPlay: false,
      currentTime: 0,
      poster: "https://t7.baidu.com/it/u=2529476510,3041785782&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1416312412643098624/64f5033b-cf7e-494e-bf77-89c8a409157c.mp4?X_PP_Audience%3D1416312412643098624%26X_PP_ExpiredAt%3D1627626337%26X_PP_GrantedAt%3D1627626337%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1416312412643098624%2F64f5033b-cf7e-494e-bf77-89c8a409157c.mp4%26X_PP_Owner%3D1416312412643098624%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3D8c3d64210ce433538ff13c00305d6ab5",
    },
    {
      id: "003",
      isPlay: false,
      currentTime: 0,
      poster: "https://t7.baidu.com/it/u=727460147,2222092211&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1419494241059569664/59afd683-915c-452f-889d-bff810afeffe.mp4?X_PP_Audience%3D1419494241059569664%26X_PP_ExpiredAt%3D1627269130%26X_PP_GrantedAt%3D1627269130%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1419494241059569664%2F59afd683-915c-452f-889d-bff810afeffe.mp4%26X_PP_Owner%3D1419494241059569664%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3Dcc03eb95a65ea06a1f69fc5d4b4cc05b",
    },
    {
      id: "004",
      isPlay: false,
      currentTime: 0,
      poster: "https://t7.baidu.com/it/u=2529476510,3041785782&fm=193&f=GIF",
      src: "https://s1.zielhome.com/community/1416312412643098624/64f5033b-cf7e-494e-bf77-89c8a409157c.mp4?X_PP_Audience%3D1416312412643098624%26X_PP_ExpiredAt%3D1627626337%26X_PP_GrantedAt%3D1627626337%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1416312412643098624%2F64f5033b-cf7e-494e-bf77-89c8a409157c.mp4%26X_PP_Owner%3D1416312412643098624%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3D8c3d64210ce433538ff13c00305d6ab5",
    },
  ]);

  const handleSlideChange: SwiperEvents["slideChangeTransitionEnd"] = (swiper) => {
    setPapers((prev) =>
      produce(prev, (draft) => {
        draft.forEach((item, index) => {
          if (index === swiper.activeIndex) {
            console.log(index, swiper.activeIndex);
            item.isPlay = !item.isPlay;
            item.currentTime = 0;
          } else item.isPlay = false;
        });
        return;
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

  return (
    <>
      <Container>
        <VideoArea ref={containerRef}>
          <StyledSwiper
            direction="vertical"
            slidesPerView={1}
            virtual
            onSlideChangeTransitionEnd={handleSlideChange}
          >
            {papers.map((paper, index) => (
              <SwiperSlide key={paper.id} virtualIndex={index}>
                <Paper
                  {...paper}
                  isFirstVideo={index === 0}
                  onTogglePlay={() => handleTogglePlay(paper)}
                  onChangeCurrentTime={(time) => handleChangeCurrentTime(paper, time)}
                />
              </SwiperSlide>
            ))}
          </StyledSwiper>
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
