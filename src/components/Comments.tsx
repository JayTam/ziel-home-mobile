import Popup from "../../lib/Popup";
import styled from "styled-components";
import CloseIcon from "../assets/icons/btn_access_highlight.svg";
import { PaperType } from "../apis/paper";
// import UnLikeIcon from "../assets/icons/unlike.svg";
import LikedIcon from "../assets/icons/liked.svg";

interface CommentType extends PaperType {
  open: boolean;
  onCommentClose?: () => void;
  onClickOverlay?: () => void;
}
const PopupContainer = styled(Popup)`
  padding: 0;
  border-radius: 20px 20px 0 0;
`;
const CommentContainer = styled.div`
  height: 77vh;
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
  flex: 1 1 0%;
  height: 100%;
  max-height: 69vh;
  overflow: auto;
  overscroll-behavior: contain;
  z-index: 1;
`;
const CommentItem = styled.div`
  margin-bottom: 14px;
`;
const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentContentTop = styled.div`
  display: flex;
  margin-bottom: 14px;
  user-select: none;
  padding: 0px 14px;
  justify-content: space-between;
`;
const AvatarLevel1 = styled.img`
  height: 24px;
  width: 24px;
`;
// const AvatarLevel2 = styled.img`
//   height: 34px;
//   width: 34px;
// `;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const UserInfo = styled.div``;
const ContentText = styled.div``;
const CommentContentBottom = styled.div``;
const CommentTime = styled.div``;
const Reply = styled.div``;
const MoreContents = styled.div`
  padding-left: 53px;
`;
const CommentHandle = styled.div`
  background-color: ${(props) => props.theme.palette.background?.comment};
  height: 8vh;
  width: 100%;
`;
const InputContent = styled.div`
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  height: 100%;
  span {
    color: ${(props) => props.theme.palette.common?.white};
    opacity: 0.5;
  }
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
const Comment: React.FC<CommentType> = (props) => {
  return (
    <>
      <PopupContainer onClickOverlay={props.onClickOverlay} open={props.open} position="bottom">
        <CommentContainer>
          <CommentStyle>
            <HeaderContent>
              <HeaderTitle>{`Comments·${props.commentNum ? props.commentNum : 0}`}</HeaderTitle>
              <CloseIcon onClick={props.onCommentClose} />
            </HeaderContent>
            {!props.commentNum ? (
              <EmptyComment>
                <span>No comments yet. Grab the couch</span>
              </EmptyComment>
            ) : (
              <CommentAreaStyle>
                <CommentItem>
                  <CommentContent>
                    <CommentContentTop>
                      <AvatarLevel1 />
                      <ContentContainer>
                        <UserInfo></UserInfo>
                        <ContentText></ContentText>
                      </ContentContainer>
                      <LikedIcon />
                    </CommentContentTop>
                    <CommentContentBottom>
                      <CommentTime></CommentTime>
                      <Reply></Reply>
                    </CommentContentBottom>
                  </CommentContent>
                  <MoreContents></MoreContents>
                </CommentItem>
              </CommentAreaStyle>
            )}
          </CommentStyle>
          <CommentHandle>
            <InputContent>
              <InputStyle placeholder="say something…" />
              <span>Send</span>
            </InputContent>
          </CommentHandle>
        </CommentContainer>
      </PopupContainer>
    </>
  );
};
export default Comment;
