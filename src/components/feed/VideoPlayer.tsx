import React, { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Play from "@/assets/play.svg";
import { replaceToImgBaseUrl, useCombinedRefs } from "@/utils";
import Loading from "#/lib/Loading";
import Image from "#/lib/Image";
import { VideoReadyState } from "@/constants";
import { PaperType } from "@/apis/paper";

export type VideoPlayerProps = PaperType & {
  className?: string;
  // 作为封面显示，还是视频显示
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
  onTogglePlay?: () => void;
  onChangeLoading?: (loading: boolean) => void;
  // 第一次播放，兼容iOS video play 必需在 eventHandler 中
  onFirstPlay?: () => void;
  // 添加一次播放记录
  onAddPlayTimes?: () => void;
};

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
  object-fit: contain;
  font-size: 0;
`;

const Poster = styled(Image)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #000;
  height: 2px;
  width: 100%;
  z-index: 1000;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #666;
`;

// 通知播放新增播放次数，当视频播放到一定百分比时，下面就是这个阀值
const PLAY_PROGRESS_FOR_ADD_PLAY_TIMES = 0.2;

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {
  // 是否第一次播放过
  const [isFirstPlayed, setIsFirstPlayed] = useState(false);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const targetRef = useCombinedRefs<HTMLVideoElement>(ref, videoPlayerRef);

  const [loadingIcon, setLoadingIcon] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  // 播放总时长，单位=秒
  const [duration, setDuration] = useState(0);
  // 已播放时长，单位=秒
  const [currentTime, setCurrentTime] = useState(0);

  // 视频播放进度样式
  const playProgressStyles = useMemo(() => {
    const percent = duration > 0 ? currentTime / duration : 0;
    return {
      width: `${percent * 100}%`,
      transition: percent > 0.01 ? "width .3s ease" : undefined,
    };
  }, [currentTime, duration]);

  // 是否通知过新增播放次数
  const hasNotifyAddPlayTimes = useRef(false);
  // 通知新增播放次数
  const notifyAddPlayTimes = useCallback(() => {
    if (currentTime / duration > PLAY_PROGRESS_FOR_ADD_PLAY_TIMES) {
      if (!hasNotifyAddPlayTimes.current) {
        hasNotifyAddPlayTimes.current = true;
        props.onAddPlayTimes?.();
      }
    }
  }, [currentTime, duration, props.id]);

  useEffect(() => {
    const player = videoPlayerRef.current;
    if (!player) return;
    // 切换video之后，重新加载video
    player.load();
    // 重置状态
    setDuration(0);
    setCurrentTime(0);
    hasNotifyAddPlayTimes.current = false;
    /**
     * 获取加载状态
     */
    const handleCloseLoading = () => {
      props.onChangeLoading?.(false);
    };
    if (player.readyState === VideoReadyState.HAVE_ENOUGH_DATA) {
      props.onChangeLoading?.(false);
    } else {
      props.onChangeLoading?.(true);
      player.addEventListener("canplay", handleCloseLoading);
    }
    /**
     * 获取视频总时长
     */
    function handleGetDuration(this: any) {
      setDuration(this.duration);
    }
    player.addEventListener("loadedmetadata", handleGetDuration);
    return () => {
      player.removeEventListener("canplay", handleCloseLoading);
      player.removeEventListener("loadedmetadata", handleGetDuration);
    };
  }, [props.id]);

  useEffect(() => {
    const player = videoPlayerRef.current;
    if (!player) return;
    /**
     * 获取视频已播放时长
     */
    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime);
      if (player.currentTime !== 0) setIsFirstPlayed(true);
      // 视频播放 20% 通知 server 记录一次播放
      notifyAddPlayTimes();
    };
    player.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      player.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [props.id, notifyAddPlayTimes]);

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
    // slider 模式下，没有 video 元素，没有相应的ref
    if (props.isPlay && !isFirstPlayed) {
      setIsFirstPlayed(true);
    }
    const player = videoPlayerRef.current;
    if (!player) return;
    if (props.isPlay) {
      // if (props.currentTime === 0) player.currentTime = 0;
      player
        .play()
        .then(() => {
          setIsFirstPlayed(true);
        })
        .catch(() => {
          // play 异步还未执行完，就执行了 pause 会抛出 error
          // 如果当前还是播放状态，修改为暂停状态
          if (props.isPlay) props.onTogglePlay?.();
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
      setIsFirstPlayed(false);
      props.onTogglePlay?.();
    } else {
      props.onTogglePlay?.();
    }
  };

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
      {props.type === "poster" ? (
        <Poster
          style={{ display: showPoster ? "inline-block" : "none" }}
          width="100%"
          height="100%"
          src={replaceToImgBaseUrl(props.poster)}
          loadingType="none"
          alt="poster"
          fit="contain"
          resizeOptions={{ w: 375 }}
        />
      ) : null}
      {/* 视频 */}
      {props.type === "video" ? (
        <Video
          className={props.className}
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
      {/* 进度条 */}
      {props.type === "video" ? (
        <ProgressContainer hidden={hiddenVideo}>
          <Progress style={playProgressStyles} />
        </ProgressContainer>
      ) : null}
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
