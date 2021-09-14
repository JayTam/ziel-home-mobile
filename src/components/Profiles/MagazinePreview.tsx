import { MagazineType } from "@/apis";
import styled from "styled-components";
import SubscribeIcon from "@/assets/icons/icon_subscribe.svg";
import { digitalScale } from "@/utils";
import Image from "next/image";
import VideoPlaceholderImage from "#/publicpublic/video_placeholder.jpg";

const Container = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 14px;
  padding-bottom: 14px;
`;
const MagazineContent = styled.div`
  height: 100%;
  width: 100%;
`;
const MagazinePoster = styled.img`
  height: 227px;
  width: 100%;
  border-radius: 14px;
`;
const PlacehoderImage = styled(Image)`
  height: 227px;
  width: 100%;
  border-radius: 14px;
`;
const SubscribeLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: -24px;
  padding-right: 6px;
`;
const SubscribeCount = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const MagazineName = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 6px;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const PickCount = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 4px;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const MagazinePreview: React.FC<MagazineType> = (props) => {
  return (
    <Container>
      <MagazineContent>
        {props.cover ? (
          <MagazinePoster src={props.cover} />
        ) : (
          <PlacehoderImage src={VideoPlaceholderImage} />
        )}
        <SubscribeLayout>
          <SubscribeIcon />
          <SubscribeCount>{digitalScale(props.subscribeNum)}</SubscribeCount>
        </SubscribeLayout>
      </MagazineContent>
      <MagazineName>{props.title}</MagazineName>
      <PickCount>{props.subscribeNum} picks</PickCount>
    </Container>
  );
};

export default MagazinePreview;
