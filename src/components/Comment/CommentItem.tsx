import UnLikeIcon from "../../assets/icons/comment-unlike.svg";
import LikedIcon from "../../assets/icons/comment-like.svg";
import styled from "styled-components";
import ReplyItem from "./ReplyItem";
import { CommentType, getReplyList, likeComment } from "../../apis/comment";
import { digitalScale, getCreateTime, useLogin } from "../../utils/";
import React, { useEffect, useImperativeHandle, useState } from "react";
import Button from "../../../lib/Button";
import { useAppSelector } from "../../app/hook";
import produce from "immer";

interface CommentItemType extends CommentType {
  authorId: string;
  open: boolean;
  onClickreply?: (comment: CommentType) => void;
  onClickLike?: (comment: CommentType) => void;
}
const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
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

const AvatarLevel1 = styled.img`
  height: 34px;
  width: 34px;
  border-radius: 50%;
`;
const ContentContainer = styled.div`
  padding-left: 8px;
  width: 100%;
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
  padding-left: 56px;
  color: ${(props) => props.theme.palette.text?.hint};
  span :nth-of-type(1) {
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    padding-right: 20px;
  }
`;
const ReplyButton = styled(Button)`
  color: ${(props) => props.theme.palette.text?.hint};
  background: none;
`;
// const CommentMore = styled(ReplyItem)``;

// const ViewMore = styled.div``;

interface CommentItemRef {
  addNewReply: (reply: CommentType) => void;
}

const CommentItem = React.forwardRef<CommentItemRef, CommentItemType>((props, ref) => {
  const user = useAppSelector((state) => state.user);
  const [replys, setReplys] = useState<CommentType[]>([]);
  const [isExpand, setIsExpand] = useState(false);
  const { withLogin } = useLogin();

  useEffect(() => {
    (async () => {
      if (props.open) {
        const response = await getReplyList(props.id, { page: 1 });
        const list = response.data.result.data;
        // const hasMore = Boolean(response.data.result.hasmore);
        setReplys((prev) => [...prev, ...list]);
      } else {
        setReplys([]);
      }
    })();
  }, [props.id, props.open]);
  useImperativeHandle(ref, () => ({
    addNewReply,
  }));

  /**
   * 在评论中，新增一个新的回复
   * @param reply
   */
  const addNewReply = (reply: CommentType) => {
    if (isExpand) {
      setReplys((replys) => [reply, ...replys]);
    } else {
      if (replys.length === 0) {
        setIsExpand(true);
      } else {
        setIsExpand(true);
        setReplys((replys) => [reply, ...replys]);
      }
    }
  };
  /**
   * 回复点赞
   */
  const replyHandleLike = withLogin<CommentType>(async (replay) => {
    if (replay) {
      const isLike = !replay.isLike;
      await likeComment(replay.id, isLike);
      setReplys((prev) =>
        produce(prev, (draft) => {
          draft.forEach((item) => {
            if (item.id === replay.id) {
              item.isLike = isLike;
              if (isLike) item.likeNum = replay.likeNum + 1;
              else item.likeNum = replay.likeNum - 1;
            }
          });
          return draft;
        })
      );
    }
  });

  return (
    <>
      <CommentContent>
        <CommentContentTop>
          <AvatarLevel1 src={props.avatar} />
          <ContentContainer>
            <UserInfo>
              {props.author} {props.authorId === props.userId ? <span>·originator</span> : ""}
            </UserInfo>
            <ContentText>{props.content}</ContentText>
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
      </CommentContent>
      {replys.map((reply) => (
        <ReplyItem
          authorId={props.authorId}
          onClickLike={replyHandleLike}
          onClickreply={props.onClickreply}
          key={reply.id}
          {...reply}
        ></ReplyItem>
      ))}
    </>
  );
});

CommentItem.displayName = "CommentItem";

export default CommentItem;
