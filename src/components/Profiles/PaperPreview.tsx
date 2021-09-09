import styled from "styled-components";
import TopFlagIcon from "../../assets/icons/star-magazine-active.svg";
import TopActiveIcon from "../../assets/icons/star-magazine.svg";
import PlayIcon from "../../assets/icons/play.svg";
import { digitalScale } from "../../utils/";
import { PaperType } from "../../apis/paper";
import VideoPlaceholderImage from "../../../public/video_placeholder.jpg";
import Image from "next/image";
import { TextEllipsisMixin } from "../../../lib/mixins";
import TopIcon from "../../assets/icons/top.svg";
import React from "react";
import Link from "next/link";

interface MagazinePagePropType extends PaperType {
  onTop?: () => void;
  isShowTop?: boolean;
  isStarContent?: boolean;
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
const PaperContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TopContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
  padding-right: 4px;
`;
const BottomContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 7px 11px;
`;
const DescriptionStyle = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Description = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.common?.white};
  ${TextEllipsisMixin}
`;
const AuthorLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;
const AvatarLayout = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const Name = styled.div`
  margin-left: 4px;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.text?.secondary}; ;
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
const PaperPreview: React.FC<MagazinePagePropType> = (props) => {
  return (
    <Link
      href={`/feed?user=${props.authorId}&type=${
        props.isStarContent ? "user_saved" : "user_paper"
      }`}
    >
      <Container>
        {props.poster ? (
          <PosterImage src={props.poster} />
        ) : (
          <PlaceholderImage src={VideoPlaceholderImage} />
        )}
        <PaperContent>
          <TopContent
            style={{ visibility: props.isShowTop ? "visible" : "hidden" }}
            onClick={props.onTop}
          >
            {props.isTop ? <TopActiveIcon /> : <TopFlagIcon />}
          </TopContent>
          {!props.isStarContent && props.status === 1 ? (
            <IsReviewing>Is reviewing</IsReviewing>
          ) : (
            ""
          )}
          <BottomContent>
            <DescriptionStyle>
              <TopIcon />
              <Description>{props.description}</Description>
            </DescriptionStyle>
            <AuthorLayout>
              <AvatarLayout>
                <Avatar src={props.avatar} />
                <Name>{props.author}</Name>
              </AvatarLayout>
              <PlayContent>
                <PlayIcon />
                <PlayCount>{digitalScale(props.playNum)}</PlayCount>
              </PlayContent>
            </AuthorLayout>
          </BottomContent>
        </PaperContent>
      </Container>
    </Link>
  );
};
export default PaperPreview;
