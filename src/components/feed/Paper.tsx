import React, { useMemo } from "react";
import styled from "styled-components";
import VideoPlayer from "./VideoPlayer";
import ShowMoreText from "react-show-more-text";
import { PaperType } from "@/apis/paper";
import UnFollowIcon from "@/assets/icons/unfollow.svg";
import UnLikeIcon from "@/assets/icons/unlike.svg";
import LikedIcon from "@/assets/icons/liked.svg";
import UnStarIcon from "@/assets/icons/unstar.svg";
import StaredIcon from "@/assets/icons/stared.svg";
import TopIcon from "@/assets/icons/top.svg";
import FollowedIcon from "@/assets/icons/followed.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import MoreIcon from "@/assets/icons/more.svg";
import { useAppSelector } from "@/app/hook";
import Link from "next/link";
import { TextEllipsisMixin } from "#/lib/mixins";
import Image from "#/lib/Image";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const BottomContainer = styled.div`
  color: ${(props) => props.theme.palette.common?.white};
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 16px 14px 10px 14px;
  width: 100%;
  background: linear-gradient(360deg, #222 -7.14%, rgba(34, 34, 34, 0) 100%);
`;

const AuthorInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled(Image)`
  width: 30px;
  min-width: 30px;
  max-width: 30px;
  height: 30px;
  border-radius: 999px;
`;

const AuthorName = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 0 20px 0 10px;
  color: ${(props) => props.theme.palette.common?.white};
  ${TextEllipsisMixin}
`;

const StyledFollowedIcon = styled(FollowedIcon)`
  width: 20px;
`;
const StyledUnFollowIcon = styled(UnFollowIcon)`
  width: 20px;
`;

const PaperInfo = styled.div`
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 10px;
`;

const PaperTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  width: auto;
  font-size: 12px;
  line-height: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  margin-right: 5px;
`;

const PaperTopIcon = styled(TopIcon)`
  vertical-align: bottom;
`;

const PaperTitle = styled.div`
  display: inline-block;
  margin-right: 10px;
  color: ${(props) => props.theme.palette.common?.white};
`;

const PaperDescription = styled.div`
  color: ${(props) => props.theme.palette.text?.hint};
`;

const PaperActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const PaperActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const PaperActionItem = styled.div`
  min-width: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 18px;
  &:last-child {
    margin: 0;
  }
`;
const PaperActionNum = styled.span`
  font-size: 12px;
  line-height: 16px;
`;

interface PaperInterface extends PaperType {
  loading?: boolean;
  active?: boolean;
  onTogglePlay?: () => void;
  onChangeCurrentTime?: (time: number) => void;
  // 第一次播放，兼容iOS video play 必需在 eventHandler 中
  onFirstPlay?: () => void;
  // 关注用户
  onFollow?: () => void;
  // 喜欢
  onLike?: () => void;
  onStar?: () => void;
  onComment?: () => void;
  onMore?: () => void;
}

const Paper: React.FC<PaperInterface> = (props) => {
  const user = useAppSelector((state) => state.user);
  const showFollowIcon = useMemo(
    () => user.uid === "" || props.authorId !== user.uid,
    [props.authorId, user.uid]
  );

  return (
    <>
      <Container>
        <VideoPlayer {...props} type="poster" />
        <BottomContainer>
          <AuthorInfo>
            <Link href={`/profile/${props.authorId}`}>
              <Avatar src={props.avatar} width={30} height={30} alt="avatar" />
            </Link>
            <AuthorName>{props.author}</AuthorName>
            {showFollowIcon ? (
              props.isFollow ? (
                <StyledFollowedIcon onClick={props.onFollow} />
              ) : (
                <StyledUnFollowIcon onClick={props.onFollow} />
              )
            ) : null}
          </AuthorInfo>

          <PaperInfo>
            <PaperTitle>
              {props.isTop ? <PaperTopIcon /> : null}
              {props.space || props.style || props.size ? (
                <PaperTag>
                  <span>{props.space}</span>
                  <span hidden={!props.style}> | {props.style}</span>
                  <span hidden={!props.size}> | {props.size}</span>
                </PaperTag>
              ) : null}
              {props.title}
            </PaperTitle>

            <PaperDescription>
              <ShowMoreText
                className="react-more-text"
                anchorClass="anchor"
                lines={1}
                more="More"
                less="Collect"
              >
                {props.description}
              </ShowMoreText>
            </PaperDescription>
          </PaperInfo>

          <PaperActionContainer>
            <PaperActions>
              <PaperActionItem onClick={props.onLike}>
                {props.isLike ? <LikedIcon /> : <UnLikeIcon />}
                <PaperActionNum>{props.likeNum}</PaperActionNum>
              </PaperActionItem>

              <PaperActionItem onClick={props.onComment}>
                <CommentIcon />
                <PaperActionNum>{props.commentNum}</PaperActionNum>
              </PaperActionItem>

              <PaperActionItem onClick={props.onStar}>
                {props.isStar ? <StaredIcon /> : <UnStarIcon />}
                <PaperActionNum>{props.starNum}</PaperActionNum>
              </PaperActionItem>
            </PaperActions>

            <PaperActionItem onClick={props.onMore}>
              <MoreIcon />
            </PaperActionItem>
          </PaperActionContainer>
        </BottomContainer>
      </Container>
    </>
  );
};

export default Paper;
