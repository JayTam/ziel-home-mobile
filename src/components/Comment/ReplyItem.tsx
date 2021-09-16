import UnLikeIcon from "@/assets/icons/comment-unlike.svg";
import LikedIcon from "@/assets/icons/comment-like.svg";
import styled from "styled-components";
import Button from "#/lib/Button";
import { CommentType } from "@/apis/comment";
import { digitalScale, getCreateTime } from "@/utils";
import { useAppSelector } from "@/app/hook";
import React from "react";
import Image from "#/lib/Image";
interface ReplyItemType extends CommentType {
  onClickreply?: (comment: CommentType) => void;
  onClickLike?: (comment: CommentType) => void;
  authorId: string;
  isShowAt: boolean;
}
const MoreContents = styled.div`
  padding-left: 53px;
  padding-top: 14px;
`;
const MoreContentItem = styled.div``;
const AvatarLevel2 = styled(Image)`
  height: 24px;
  width: 24px;
  min-width: 24px;
  max-width: 24px;
  border-radius: 50%;
  align-self: flex-start;
  margin-top: 2px;
`;
const CommentContentTop = styled.div`
  display: flex;
  height: 100%;
  margin-bottom: 4px;
  user-select: none;
  padding: 0px 11px 0 14px;
  justify-content: space-between;
  align-items: center;
`;
const ContentContainer = styled.div`
  padding-left: 8px;
  width: calc(100% - 22px);
  display: flex;
  flex-direction: column;
`;
const UserInfo = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.hint};
  span {
    color: ${(props) => props.theme.palette.text?.special};
  }
`;
const ContentText = styled.div`
  margin-top: 4px;
  color: ${(props) => props.theme.palette.common?.white};
  span {
    color: #ffa952;
  }
`;
const LikeStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.palette.common?.white};
  }
`;
const CommentContentBottom = styled.div`
  padding-left: 46px;
  span {
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.palette.text?.hint};
    padding-right: 20px;
  }
`;
const ReplyButton = styled(Button)`
  color: ${(props) => props.theme.palette.text?.hint};
  background: none;
  height: auto;
`;
const ReplyItem = React.forwardRef<HTMLDivElement, ReplyItemType>((props, ref) => {
  const user = useAppSelector((state) => state.user);

  return (
    <MoreContents ref={ref}>
      <MoreContentItem>
        <CommentContentTop>
          <AvatarLevel2 height={24} width={24} blur src={props.avatar} />
          <ContentContainer>
            <UserInfo>
              {props.author} {props.authorId === props.userId ? <span>·originator</span> : ""}
            </UserInfo>
            <ContentText>
              <span>{props.isShowAt ? `@${props.parentUser}:` : ""}</span>
              {props.content}
            </ContentText>
          </ContentContainer>
          <LikeStyle onClick={() => props.onClickLike?.(props)}>
            {props.isLike ? <LikedIcon /> : <UnLikeIcon />}
            <span>{digitalScale(props.likeNum)}</span>
          </LikeStyle>
        </CommentContentTop>
        <CommentContentBottom>
          <span>{getCreateTime(props.createTime)}</span>
          {user.uid !== props.userId ? (
            <ReplyButton onClick={() => props.onClickreply?.(props as CommentType)}>
              Reply
            </ReplyButton>
          ) : (
            ""
          )}
        </CommentContentBottom>
      </MoreContentItem>
    </MoreContents>
  );
});
ReplyItem.displayName = "ReplyItem";
export default ReplyItem;
