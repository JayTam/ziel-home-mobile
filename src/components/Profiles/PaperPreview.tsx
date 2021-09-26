import styled from "styled-components";
import PlayIcon from "@/assets/icons/play.svg";
import { digitalScale } from "@/utils";
import { PaperType } from "@/apis/paper";
import VideoPlaceholderImage from "#/public/video_placeholder.jpg";
import Image from "next/image";
import { TextEllipsisMixin } from "#/lib/mixins";
import TopIcon from "@/assets/icons/top.svg";
import React from "react";
import { TFeedType } from "@/pages/feed";
import OssImage from "#/lib/Image";

interface MagazinePagePropType extends PaperType {
  dataSource: TFeedType;
  onOpenFeed?: (type: TFeedType) => void;
}

const Container = styled.div<{ dataSource: TFeedType }>`
  margin-top: ${(props) =>
    props.dataSource === "user_paper" || props.dataSource === "user_saved" ? "4px" : 0};
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const PosterImage = styled(OssImage)`
  border-radius: 14px;
`;
const PlaceholderImage = styled(Image)`
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const BottomContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 10px 6px 7px;
  background: linear-gradient(360deg, #222222 -7.14%, rgba(34, 34, 34, 0) 100%);
  border-radius: 14px;
`;
const Title = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.palette.common?.white};
  ${TextEllipsisMixin}
`;

const PlayContent = styled.div`
  display: flex;
  align-items: center;
`;
const PlayCount = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary}; ;
`;
const IsReviewing = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 76px;
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  color: ${(props) => props.theme.palette.common?.white};
  border-radius: 0 14px 0 14px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PaperTopIcon = styled(TopIcon)`
  display: inline-block;
  vertical-align: bottom;
`;
const AuthorLayout = styled.div<{ dataSource: TFeedType }>`
  display: flex;
  align-items: center;
  visibility: ${(props) => (props.dataSource === "default" ? "visible" : "hidden")};
`;

const AuthorStyle = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Avatar = styled(OssImage)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;
const Name = styled.div`
  margin-left: 4px;
  width: 48px;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.hint};
  ${TextEllipsisMixin}
`;

const PaperPreview: React.FC<MagazinePagePropType> = (props) => {
  return (
    <Container dataSource={props.dataSource} onClick={() => props.onOpenFeed?.(props.dataSource)}>
      {props.poster ? (
        <PosterImage
          src={props.poster}
          resizeOptions={{ w: 170, h: 302 }}
          zoomOptions={{ w: 100, h: 178 }}
        />
      ) : (
        <PlaceholderImage src={VideoPlaceholderImage} />
      )}
      {props.dataSource === "user_paper" && props.status === 1 ? (
        <IsReviewing>under review</IsReviewing>
      ) : null}
      <BottomContent>
        <Title>
          {props.isTop ? <PaperTopIcon /> : null}
          {props.title} {props.title}
        </Title>
        <AuthorStyle>
          <AuthorLayout dataSource={props.dataSource}>
            <Avatar resizeOptions={{ w: 24, h: 24 }} src={props.avatar} />
            <Name>{props.author}</Name>
          </AuthorLayout>
          <PlayContent>
            <PlayIcon style={{ width: "24px", height: "24px" }} />
            <PlayCount>{digitalScale(props.playNum)}</PlayCount>
          </PlayContent>
        </AuthorStyle>
      </BottomContent>
    </Container>
  );
};
export default PaperPreview;
