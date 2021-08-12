import React from "react";
import styled from "styled-components";
import VideoPlayer from "./VideoPlayer";
import { PaperType } from "../../pages";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface PaperInterface extends PaperType {
  loading?: boolean;
  active?: boolean;
  onTogglePlay?: (isPlay: boolean) => void;
  onChangeCurrentTime?: (time: number) => void;
  // 第一次播放，兼容iOS video play 必需在 eventHandler 中
  onFirstPlay?: () => void;
}

const Paper: React.FC<PaperInterface> = (props) => {
  return (
    <Container>
      <VideoPlayer {...props} type="poster" />
    </Container>
  );
};

export default Paper;
