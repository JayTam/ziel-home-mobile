import UnLikeIcon from "../../assets/icons/comment-unlike.svg";
import LikedIcon from "../../assets/icons/comment-like.svg";
import styled from "styled-components";
import Button from "../../../lib/Button";
import { CommentType } from "../../apis/comment";
import { digitalScale, getCreateTime } from "../../utils";
import { useAppSelector } from "../../app/hook";
interface CommentMoreType extends CommentType {
  onClickreply?: (comment: CommentType) => void;
  onClickLike?: (comment: CommentType) => void;
  authorId: string;
}
const MoreContents = styled.div`
  padding-left: 53px;
  padding-top: 14px;
`;
const MoreContentItem = styled.div``;
const AvatarLevel2 = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
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
`;
const CommentMore: React.FC<CommentMoreType> = (props) => {
  const user = useAppSelector((state) => state.user);
  // const getCommentText = () => {};
  return (
    <>
      <MoreContents>
        <MoreContentItem>
          <CommentContentTop>
            <AvatarLevel2 src={props.avatar} />
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
        </MoreContentItem>
      </MoreContents>
    </>
  );
};
export default CommentMore;
