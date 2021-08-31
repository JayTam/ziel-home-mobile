import Popup from "../../lib/Popup";
import styled from "styled-components";
import CloseIcon from "../assets/icons/btn_access_highlight.svg";
import { PaperType } from "../apis/paper";

interface CommentType extends PaperType {
  open: boolean;
  onCommentClose?: () => void;
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
const CommentContent = styled.div`
  border-radius: 20px 20px 0 0;
  background-color: ${(props) => props.theme.palette.common?.black};
  height: 69vh;
  width: 100%;
`;
const CommentHandle = styled.div`
  background-color: ${(props) => props.theme.palette.background?.comment};
  height: 8vh;
  width: 100%;
`;
const InputContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  span {
    color: ${(props) => props.theme.palette.common?.white};
    opacity: 0.5;
  }
  & span:nth-of-type(1) {
    margin-right: 20px;
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
`;
const Comment: React.FC<CommentType> = (props) => {
  return (
    <>
      <PopupContainer open={props.open} position="bottom">
        <CommentContainer>
          <CommentContent>
            <HeaderContent>
              <HeaderTitle>{`Comments·${props.commentNum ? props.commentNum : 0}`}</HeaderTitle>
              <CloseIcon onClick={props.onCommentClose} />
            </HeaderContent>
          </CommentContent>
          <CommentHandle>
            <InputContent>
              <InputStyle placeholder="say something…" />
              <span>@</span>
              <span>Send</span>
            </InputContent>
          </CommentHandle>
        </CommentContainer>
      </PopupContainer>
    </>
  );
};
export default Comment;
