import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Play from "../../assets/play.svg";
import { useCombinedRefs } from "../../utils";
import Loading from "../../../lib/Loading";
import VideoPlaceholderImage from "../../../public/video_placeholder.jpg";
import Image from "next/image";

export type VideoPlayerProps = {
  className?: string;
  type?: "poster" | "video";
  hidden?: boolean;
  // 激活状态
  active?: boolean;
  // slider 触摸中
  touching?: boolean;
  // 视频资源加载状态
  loading?: boolean;
  // 视频地址
  video?: string;
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
  isPlay?: boolean;
  onTogglePlay?: (isPlay: boolean) => void;
  onChangeCurrentTime?: (time: number) => void;
  // 第一次播放，兼容iOS video play 必需在 eventHandler 中
  onFirstPlay?: () => void;
};

const Container = styled.div<VideoPlayerProps>`
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
`;

const Poster = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPlaceHolder = styled(Image)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoLoading = styled(Loading)`
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

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {
  // 是否第一次播放过
  const [isFirstPlayed, setIsFirstPlayed] = useState(false);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const targetRef = useCombinedRefs<HTMLVideoElement>(ref, videoPlayerRef);

  const [loadingIcon, setLoadingIcon] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (props.loading) {
      timer.current = setTimeout(() => {
        setLoadingIcon(true);
      }, 1000);
    } else {
      setLoadingIcon(false);
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [props.loading]);

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
    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [props.video]);

  useEffect(() => {
    // slider 模式下，没有 video 元素，没有相应的ref
    if (props.isPlay && !isFirstPlayed) {
      setIsFirstPlayed(true);
    }
    const player = videoPlayerRef.current;
    if (!player) return;
    if (props.isPlay) {
      if (props.currentTime === 0) player.currentTime = 0;
      player
        .play()
        .then(() => {
          setIsFirstPlayed(true);
        })
        .catch(() => {
          // play 异步还未执行完，就执行了 pause 会抛出 error
          // 如果当前还是播放状态，修改为暂停状态
          if (props.isPlay) props.onTogglePlay?.(false);
        });
    } else {
      player.pause();
    }
  }, [props.isPlay]);

  const handleClickPlay: MouseEventHandler = () => {
    if (props.touching) return;
    // safari video play 需在 event handler 中，不然会被拒绝
    if (!isFirstPlayed) {
      props.onFirstPlay?.();
      setIsFirstPlayed(true);
    } else {
      props.onTogglePlay?.(props.isPlay ?? false);
    }
  };

  useEffect(() => {
    const player = videoPlayerRef.current;
    if (player) player.load();
  }, [props.video]);

  /**
   * 显示视频封面
   * 1. touching 一直显示
   * 2. 首次没有播放时显示
   * 3. 资源loading显示
   */
  const showPoster = useMemo(() => {
    return props.touching || !isFirstPlayed || props.loading;
  }, [isFirstPlayed, props.touching, props.loading]);

  /**
   * 隐藏视频
   * 1. touching 隐藏
   * 2. 还未播放时隐藏
   * 3. 资源loading隐藏
   */
  const hiddenVideo = useMemo(() => {
    return props.touching || !isFirstPlayed || props.loading;
  }, [isFirstPlayed, props.touching, props.loading]);

  const hiddenLoading = useMemo(() => {
    return !props.loading || !props.isPlay || !loadingIcon;
  }, [props.loading, props.isPlay, loadingIcon]);

  const hiddenPlayIcon = useMemo(() => {
    return !props.active || props.isPlay;
  }, [props.active, props.isPlay]);

  return (
    <Container
      onClick={handleClickPlay}
      hidden={props.hidden}
      style={{ backgroundColor: props.type === "video" ? "#000" : "transparent" }}
    >
      {/* 加载条 */}
      {props.type === "poster" ? <VideoLoading hidden={hiddenLoading} size={50} /> : null}
      {/* 视频封面 */}
      {props.type === "poster" && showPoster ? (
        props.poster ? (
          <Poster src={props.poster} alt="poster" />
        ) : (
          <VideoPlaceHolder src={VideoPlaceholderImage} alt="poster" layout="fill" />
        )
      ) : null}
      {/* 视频 */}
      {props.type === "video" ? (
        <Video
          hidden={hiddenVideo}
          ref={targetRef}
          autoPlay={props.autoplay}
          muted={props.muted}
          controls={props.controls}
          loop={props.loop}
          playsInline={true}
        >
          <source src={props.video} />
        </Video>
      ) : null}
      {/* 播放按钮 */}
      {props.type === "poster" ? <PlayIcon hidden={hiddenPlayIcon} /> : null}
    </Container>
  );
});

VideoPlayer.displayName = "VideoPlayer";

VideoPlayer.defaultProps = {
  type: "video",
  autoplay: false,
  muted: false,
  controls: false,
  currentTime: 0,
  loop: true,
  loading: false,
};

export default VideoPlayer;
