import UnLikeIcon from "../../assets/icons/comment-unlike.svg";
import LikedIcon from "../../assets/icons/comment-like.svg";
import styled from "styled-components";
import ReplyItem from "./ReplyItem";
import { CommentType, getReplyList, likeComment } from "../../apis/comment";
import { digitalScale, getCreateTime, useLogin } from "../../utils/";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import Button from "../../../lib/Button";
import { useAppSelector } from "../../app/hook";
import produce from "immer";
import { useUpdateEffect } from "ahooks";
import Loading from "../../../lib/Loading";
import TriangleOpen from "../../assets/icons/triangle_open.svg";
import TriangleHide from "../../assets/icons/triangle_hide.svg";

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
  align-self: flex-start;
  margin-top: 2px;
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
  word-break: break-all;
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
  height: auto;
`;
const ViewMore = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 0 0 99px;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.hint};
`;

interface CommentItemRef {
  addNewReply: (reply: CommentType) => void;
}

const CommentItem = React.forwardRef<CommentItemRef, CommentItemType>((props, ref) => {
  const user = useAppSelector((state) => state.user);
  const [replys, setReplys] = useState<CommentType[]>([]);
  const [moreStatus, setMoreStatus] = useState<"close" | "more" | "hide">("close");
  const { withLogin } = useLogin();
  const commentRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (props.open && props.replyNum > 0 && count === 0) {
        const response = await getReplyList(props.id, { page: 1 });
        setCount(response.data.result.count);
      }
    })();
  });

  useUpdateEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (props.open && moreStatus !== "close") {
          const response = await getReplyList(props.id, { page });
          const list = response.data.result.data;
          setCount(response.data.result.count);
          setHasMore(Boolean(response.data.result.hasmore));
          if (!response.data.result.hasmore) setMoreStatus("hide");
          setReplys((prev) => [...prev, ...list]);
        } else {
          setReplys([]);
        }
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);
  useImperativeHandle(ref, () => ({
    addNewReply,
  }));

  /**
   * 点击更多
   */
  const handleMore = () => {
    switch (moreStatus) {
      case "close":
        setPage(1);
        setMoreStatus("more");
        break;
      case "more":
        if (hasMore) setPage(page + 1);
        break;
      case "hide":
        setMoreStatus("close");
        setPage(0);
        break;
    }
  };

  /**
   * 在评论中，新增一个新的回复
   * @param reply
   */
  const addNewReply = (reply: CommentType) => {
    setReplys((replys) => [reply, ...replys]);
    commentRef.current?.scrollIntoView();
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
  const getViewMoreText = (count: number) => {
    let resultText = "";
    switch (moreStatus) {
      case "close":
        resultText = `See more replies (${count})`;
        break;
      case "more":
        resultText = "See more replies";
        break;
      case "hide":
        resultText = "Hide";
        break;
    }
    return resultText;
  };

  return (
    <div ref={commentRef}>
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
      <div>
        {replys.map((reply) => (
          <ReplyItem
            authorId={props.authorId}
            onClickLike={replyHandleLike}
            onClickreply={props.onClickreply}
            key={reply.id}
            {...reply}
            isShowAt={props.userId !== reply.parentUserId}
          ></ReplyItem>
        ))}
        {hasMore && loading ? <Loading ref={loaderRef} /> : null}
        {count !== 0 ? (
          <ViewMore onClick={handleMore}>
            <span>{getViewMoreText(count)}</span>
            {moreStatus !== "hide" ? <TriangleOpen /> : <TriangleHide />}
          </ViewMore>
        ) : (
          ""
        )}
      </div>
    </div>
  );
});

CommentItem.displayName = "CommentItem";

export default CommentItem;
