import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Play from "../../assets/play.svg";
import Loading from "../../../lib/Loading";

export type VideoPlayerProps = {
  className?: string;
  // 首屏Video Player
  isFirstVideo?: boolean;
  // 视频地址
  src?: string;
  // 视频封面
  poster?: string;
  // 控制器
  controls?: boolean;
  // 是否循环播放
  loop?: boolean;
  // 是否禁音乐
  muted?: boolean;
  // 是否自动播放
  autoplay?: boolean;
  // 当前播放时间
  currentTime?: number;
  // 播放中
  isPlay: boolean;
  onTogglePlay?: (isPlay: boolean) => void;
  onChangeCurrentTime?: (time: number) => void;
};

export enum VideoReadyState {
  HAVE_NOTHING,
  HAVE_METADATA,
  HAVE_CURRENT_DATA,
  HAVE_FUTURE_DATA,
  HAVE_ENOUGH_DATA,
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0;
  background: ${(props) => props.theme.palette.common?.black};
`;

const Video = styled.video`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  font-size: 0;
  z-index: 2;
`;

const Poster = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const LoadingIcon = styled(Loading)`
  position: absolute;
  left: 50%;
  top: calc(50% - 50px);
  transform: translate(-50%, -50%);
  z-index: 3;
`;

const PlayIcon = styled(Play)`
  position: absolute;
  left: 50%;
  top: calc(50% - 50px);
  transform: translate(-50%, -50%);
  z-index: 3;
`;

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(!props.isFirstVideo);

  // 是否播放过
  const [isFirstPlayed, setIsFirstPlayed] = useState(false);

  useEffect(() => {
    const player = videoPlayerRef.current;
    if (!player) return;
    /**
     * 视频当前播放时间更新
     */
    const handleTimeUpdate = () => {
      props.onChangeCurrentTime?.(player.currentTime);
      if (player.currentTime !== 0) {
        setIsFirstPlayed(true);
      }
    };
    player.addEventListener("timeupdate", handleTimeUpdate);
    /**
     * 视频资源加载状态控制
     */
    let timer: NodeJS.Timeout;
    const handleCloseLoading = () => {
      setLoading(false);
      clearTimeout(timer);
    };
    // 如果已经加载完毕了，直接关闭
    if (player.readyState === VideoReadyState.HAVE_ENOUGH_DATA) {
      setLoading(false);
    } else {
      timer = setTimeout(() => {
        setLoading(true);
      }, 2000);
      player.addEventListener("loadeddata", handleCloseLoading);
    }

    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
      player.removeEventListener("loadeddata", handleCloseLoading);
    };
  }, []);

  useEffect(() => {
    console.log("isPlay update times", props.isPlay);
    const player = videoPlayerRef.current;
    if (player) {
      if (props.isPlay) {
        if (props.currentTime === 0) player.currentTime = 0;
        player
          .play()
          .then(() => {
            setIsFirstPlayed(true);
          })
          .catch((error) => {
            console.error(error);
            props.onTogglePlay?.(false);
          });
      } else {
        player.pause();
      }
    }
  }, [props.isPlay]);

  const handleClickPlay: MouseEventHandler = (event) => {
    // safari video play 需在 event handler 中，不然会被拒绝
    if (!isFirstPlayed) {
      videoPlayerRef.current?.play().then(() => {
        setIsFirstPlayed(true);
      });
    }
    props.onTogglePlay?.(props.isPlay);
  };

  return (
    <Container onClick={handleClickPlay}>
      {/* 加载效果 */}
      {loading ? <LoadingIcon /> : null}
      {/* 封面，仅还未播放过才展示 */}
      <Poster src={props.poster} />
      <Video
        hidden={!isFirstPlayed}
        ref={videoPlayerRef}
        autoPlay={props.autoplay}
        muted={props.muted}
        controls={props.controls}
        loop={props.loop}
        playsInline={true}
      >
        <source src={props.src} />
      </Video>
      {/*/!* 播放按钮 *!/*/}
      <PlayIcon hidden={loading || props.isPlay} />
    </Container>
  );
};

VideoPlayer.defaultProps = {
  isFirstVideo: true,
  autoplay: false,
  muted: false,
  controls: false,
  currentTime: 0,
  loop: true,
};

export default VideoPlayer;
