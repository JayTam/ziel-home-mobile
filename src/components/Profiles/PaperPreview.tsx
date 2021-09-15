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
import { TType } from "@/pages/feed";

interface MagazinePagePropType extends PaperType {
  dataSource: TType;
}

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const PosterImage = styled.img`
  height: 302px;
  width: 100%;
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
  justify-content: flex-end;
  padding: 0 7px 11px;
`;
const TitleStyle = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Title = styled.div`
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.palette.common?.white};
`;
const AuthorLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const Name = styled.div`
  flex: 1;
  margin-left: 4px;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.text?.secondary};
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
          <PosterImage src={props.poster} />
        ) : (
          <PlaceholderImage src={VideoPlaceholderImage} />
        )}
        {props.dataSource === "user_paper" && props.status === 1 ? (
          <IsReviewing>Is reviewing</IsReviewing>
        ) : null}
        <BottomContent>
          <TitleStyle>
            <Title>
              {props.isTop ? <PaperTopIcon /> : null}
              {props.title} {props.title}
            </Title>
          </TitleStyle>
          <AuthorLayout>
            <Avatar src={props.avatar} />
            <Name>{props.author}</Name>
            <PlayContent>
              <PlayIcon />
              <PlayCount>{digitalScale(props.playNum)}</PlayCount>
            </PlayContent>
          </AuthorLayout>
        </BottomContent>
      </Container>
    </Link>
  );
};
export default PaperPreview;
