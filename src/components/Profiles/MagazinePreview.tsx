import { MagazineType } from "@/apis";
import styled from "styled-components";
import { digitalScale } from "@/utils";
import Image from "next/image";
import VideoPlaceholderImage from "#/public/video_placeholder.jpg";
import OssImage from "#/lib/Image";

const Container = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const MagazineContent = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
const PosterContent = styled(OssImage)`
  height: 100%;
  width: 92%;
  top: 0;
  left: 4%;
  border-radius: 10px;
  box-shadow: 0px 4px 20px 0px #00000033;
`;
const PosterMask = styled.div`
  border-radius: 20px;
  position: absolute;
  top: 4%;
  left: 0;
  width: 100%;
  height: 92%;
  background-color: ${(props) => props.theme.palette.background?.paper};
`;
const PlacehoderImage = styled(Image)`
  height: 227px;
  width: 100%;
  border-radius: 14px;
`;
const MagazineName = styled.div`
  margin-top: 14px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  font-family: "DidotBold", serif;
`;
const PickCount = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
  opacity: 0.5;
`;
const MagazinePreview: React.FC<MagazineType> = (props) => {
  return (
    <Container>
      <MagazineContent>
        <PosterMask />
        {props.cover ? (
          <PosterContent
            blur
            resizeOptions={{ w: 300, h: 400 }}
            zoomOptions={{ w: 92, h: 122.6 }}
            src={props.cover}
          />
        ) : (
          <PlacehoderImage src={VideoPlaceholderImage} />
        )}
      </MagazineContent>
      <MagazineName>{props.title}</MagazineName>
      <PickCount>
        {digitalScale(props.subscribeNum)} subscribers · {digitalScale(props.paperNum)} storys
      </PickCount>
    </Container>
  );
};

export default MagazinePreview;
