import Popup from "#/lib/Popup";
import styled from "styled-components";
import CloseIcon from "@/assets/icons/btn_access_highlight.svg";
import CommentsItem from "./CommentItem";
import { PaperType } from "@/apis/paper";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CommentType, getCommentList, likeComment, replyComment, replyPaper } from "@/apis/comment";
import Button from "#/lib/Button";
import produce from "immer";
import { useInfiniteScroll, useLogin } from "@/utils";
import Loading from "#/lib/Loading";

interface CommentProps extends PaperType {
  open: boolean;
  onCommentClose?: () => void;
  onClickOverlay?: () => void;
}
const PopupContainer = styled(Popup)`
  padding: 0;
  border-radius: 20px 20px 0 0;
`;
const CommentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 1s linear;
`;
const HeaderContent = styled.div`
  display: flex;
  padding: 14px;
  align-items: center;
`;
const HeaderTitle = styled.div`
  width: calc(100% - 30px);
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  margin-left: 30px;
  color: ${(props) => props.theme.palette.common?.white};
`;
const CommentStyle = styled.div`
  border-radius: 20px 20px 0 0;
  background-color: ${(props) => props.theme.palette.common?.black};
  height: 69vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const EmptyComment = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.palette.common?.white};
`;
const CommentAreaStyle = styled.div`
  height: 100%;
  overflow: scroll;
  padding-bottom: 10px;
`;
const CommentItemStyle = styled(CommentsItem)`
  margin-bottom: 14px;
  z-index: 1;
`;

const CommentHandle = styled.div`
  background-color: ${(props) => props.theme.palette.background?.comment};
  height: 8vh;
  width: 100%;
  z-index: 2;
`;
const InputContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  height: 100%;
`;
const InputStyle = styled.input`
  background-color: ${(props) => props.theme.palette.common?.black};
  border: none;
  border-radius: 42px;
  width: 100%;
  padding: 11px 14px;
  font-size: 16px;
  line-height: 19px;
  margin-right: 20px;
  outline: none;
  color: ${(props) => props.theme.palette.common?.white};
`;
const SendButton = styled(Button)`
  color: ${(props) => props.theme.palette.text?.hint};
  background: none;
`;

export interface CommentItemHandle {
  addNewReply: (reply: CommentType) => void;
}
const Comment: React.FC<CommentProps> = (props) => {
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [currentComment, setCurrentComment] = useState<CommentType | null>(null);
  const [currentReply, setCurrentReply] = useState<CommentType | null>(null);
  const currentCommentRef = useRef<CommentItemHandle>(null);
  const { withLogin } = useLogin();
  const commentTextContent = useMemo(() => {
    return commentText.replace(/Reply @(.+?):/, "").trim();
  }, [commentText]);
  const scrollTopRef = useRef<HTMLDivElement | null>(null);
  const {
    loaderRef,
    hasMore,
    page,
    setHasMore,
    setLoading,
    firstLoading,
    setFirstLoading,
    setPage,
  } = useInfiniteScroll<HTMLDivElement>({
    hasMore: false,
    initialPage: 1,
  });

  useEffect(() => {
    (async () => {
      if (props.open) {
        try {
          setLoading(true);
          const response = await getCommentList(props.id, { page });
          const list = response.data.result.data;
          const hasMore = Boolean(response.data.result.hasmore);
          setHasMore(hasMore);
          setCommentList((prev) => [...prev, ...list]);
        } catch {
          console.log("getComment error");
        } finally {
          setLoading(false);
          setFirstLoading(false);
        }
      } else {
        setPage(1);
        setFirstLoading(true);
        setCommentList([]);
      }
    })();
  }, [props.id, props.open, page, setFirstLoading, setHasMore, setLoading]);

  /**
   * 发送评论
   */
  const handleSendCommentWithLogin = withLogin(async () => {
    if (!commentText.trim()) {
      setCommentText(commentText.trim());
      return;
    }
    if (currentComment) {
      /**
       * 回复评论
       */

      const target = currentReply ? currentReply : currentComment;

      const response = await replyComment(
        props.id,
        commentTextContent,
        target.id,
        target.userId,
        target.author
      );
      if (currentCommentRef.current) {
        const data = response.data.result;
        const reply: CommentType = {
          id: data.id,
          content: data.contents,
          createTime: data.created_at,
          likeNum: data.like_num,
          commentNum: data.reply_num,
          author: data.user_info.nickname,
          avatar: data.user_info.avatar,
          userId: data.user_info.id,
          isLike: false,
          replyNum: data.reply_num,
          parentUser: data.parent_user,
          parentUserId: data.parent_user_id,
        };
        // 更新当前评论的回复，更新当前评论的回复量
        setCommentList((commentList) =>
          produce(commentList, (draftState) => {
            const index = draftState.findIndex(({ id }) => id === currentComment.id);
            if (index >= 0) {
              draftState[index].commentNum += 1;
            }
          })
        );
        currentCommentRef.current.addNewReply(reply);
      }
    } else {
      const response = await replyPaper(props.id, commentText);
      const data = response.data.result;
      // 把这条当前用户的评论，追加到评论列表第一条
      const comment: CommentType = {
        id: data.id,
        content: data.contents,
        createTime: data.created_at,
        likeNum: data.like_num,
        commentNum: data.reply_num,
        author: data.user_info.nickname,
        avatar: data.user_info.avatar,
        userId: data.user_info.id,
        isLike: false,
        replyNum: data.reply_num,
        parentUser: data.parent_user,
        parentUserId: data.parent_user_id,
      };
      setCommentList((commentList) => [comment, ...commentList]);
      console.log(commentList);
      scrollTopRef.current?.scrollIntoView();
    }
    setCommentText("");
    setCurrentReply(null);
    setCurrentComment(null);
  });

  const handleClickReplyComment = async (comment: CommentType, reply: CommentType) => {
    setCommentText(`Reply @${reply.author}: `);
    if (comment.id === reply.id) {
      // 点击的是CommentItem的 reply
      setCurrentComment(comment);
      setCurrentReply(null);
    } else {
      // 点击的是ReplyItem的 reply
      setCurrentComment(comment);
      setCurrentReply(reply);
    }
  };

  /**
   * 评论点赞
   */
  const handleLike = withLogin<CommentType>(async (comment) => {
    if (comment) {
      const isLike = !comment.isLike;
      await likeComment(comment.id, isLike);
      setCommentList((prev) =>
        produce(prev, (draft) => {
          draft.forEach((item) => {
            if (item.id === comment.id) {
              item.isLike = isLike;
              if (isLike) item.likeNum = comment.likeNum + 1;
              else item.likeNum = comment.likeNum - 1;
            }
          });
          return draft;
        })
      );
    }
  });

  return (
    <>
      <PopupContainer onClickOverlay={props.onClickOverlay} open={props.open} position="bottom">
        <CommentContainer>
          <CommentStyle>
            <HeaderContent>
              <HeaderTitle>{`Comments·${props.commentNum ? props.commentNum : 0}`}</HeaderTitle>
              <CloseIcon onClick={props.onCommentClose} />
            </HeaderContent>

            {commentList.length === 0 && !firstLoading ? (
              <EmptyComment>
                <span>No comments yet. Grab the couch</span>
              </EmptyComment>
            ) : null}

            {commentList.length > 0 ? (
              <CommentAreaStyle>
                <div ref={scrollTopRef}>
                  {commentList.map((comment) => (
                    <CommentItemStyle
                      onClickreply={(reply) => handleClickReplyComment(comment, reply)}
                      onClickLike={handleLike}
                      open={props.open}
                      key={comment.id}
                      authorId={props.authorId}
                      {...comment}
                      ref={comment.id === currentComment?.id ? currentCommentRef : null}
                    />
                  ))}
                  {hasMore ? <Loading ref={loaderRef} /> : null}
                </div>
              </CommentAreaStyle>
            ) : null}
          </CommentStyle>
          <CommentHandle>
            <InputContent>
              <InputStyle
                maxLength={255}
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
                placeholder="say something…"
              />
              <SendButton onClick={handleSendCommentWithLogin}>Send</SendButton>
            </InputContent>
          </CommentHandle>
        </CommentContainer>
      </PopupContainer>
    </>
  );
};
export default Comment;
