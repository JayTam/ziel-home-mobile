import styled from "styled-components";
import PlayIcon from "@/assets/icons/play.svg";
import { digitalScale } from "@/utils";
import { PaperType } from "@/apis/paper";
import VideoPlaceholderImage from "#/public/video_placeholder.jpg";
import Image from "next/image";
import { TextEllipsisMixin } from "#/lib/mixins";
import TopIcon from "@/assets/icons/top.svg";
import React from "react";
import Link from "next/link";
import { TFeedType } from "@/pages/feed";
import OssImage from "#/lib/Image";

interface MagazinePagePropType extends PaperType {
  dataSource: TFeedType;
}

const Container = styled.div`
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
  padding: 0 10px 11px 7px;
`;
const Title = styled.div`
  width: 100%;
  font-size: 12px;
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
  font-size: 12px;
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

const PaperPreview: React.FC<MagazinePagePropType> = (props) => {
  let link;
  if (props.dataSource === "default") {
    link = `/feed?magazine_id=${props.magazine?.id}&paper_id=${props.id}`;
  } else {
    link = `/feed?user=${props.authorId}&type=${props.dataSource}`;
  }

  return (
    <Link href={link}>
      <Container>
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
          <IsReviewing>Is reviewing</IsReviewing>
        ) : null}
        <BottomContent>
          <Title>
            {props.isTop ? <PaperTopIcon /> : null}
            {props.title} {props.title}
          </Title>
          <PlayContent>
            <PlayIcon />
            <PlayCount>{digitalScale(props.playNum)}</PlayCount>
          </PlayContent>
        </BottomContent>
      </Container>
    </Link>
  );
};
export default PaperPreview;
