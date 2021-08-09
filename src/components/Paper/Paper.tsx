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
  isFirstVideo?: boolean;
  onTogglePlay?: (isPlay: boolean) => void;
  onChangeCurrentTime?: (time: number) => void;
}

const Paper: React.FC<PaperInterface> = (props) => {
  return (
    <Container>
      <VideoPlayer
        src={props.src}
        poster={props.poster}
        isPlay={props?.isPlay ?? false}
        currentTime={props.currentTime}
        onTogglePlay={props.onTogglePlay}
        onChangeCurrentTime={props.onChangeCurrentTime}
      />
    </Container>
  );
};

export default Paper;
