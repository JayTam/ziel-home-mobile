import React, { useMemo } from "react";
import styled from "styled-components";
// import RecommendIcon from "../assets/icons/recommend.svg";
import DeleteIcon from "../assets/icons/more-operate-delete.svg";
// import ReportIcon from "../assets/icons/report.svg";
// import SaveIcon from "../assets/icons/save.svg";
// import CollectionIcon from "../assets/icons/collection.svg";
import SmsIcon from "../assets/icons/sms.svg";
import PinterestIcon from "../assets/icons/Pinterest.svg";
// import CopyIcon from "../assets/icons/copy.svg";
import FacebookIcon from "../assets/icons/facebook.svg";
// import InsIcon from "../assets/icons/ins.svg";
import { MagazineType } from "../apis";
import { PaperType } from "../apis/paper";
import Popup from "../../lib/Popup";
import { useAppSelector } from "../app/hook";

interface MoreOperateType {
  open: boolean;
  magazine?: MagazineType;
  paper?: PaperType;
  moreType: "paper" | "magazine";
  onDelete?: () => void;
  onClose?: () => void;
}

const StyledPopup = styled(Popup)`
  padding: 0;
  margin: 0;
  border-radius: 20px 20px 0 0;
`;
const Container = styled.div`
  padding: 30px 0 0 0;
`;
const TopContainer = styled.div`
  padding: 0 4px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  div:nth-of-type(n + 5) {
    margin-top: 20px;
  }
  span {
    margin-top: 6px;
    font-size: 14px;
    line-height: 16px;
  }
`;
const ItemStyle = styled.div`
  display: flex;
  flex: 0 0 25%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const BottomContainer = styled.div`
  padding: 14px 4px 0 4px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  div:nth-of-type(n + 5) {
    margin-top: 20px;
  }
  span {
    margin-top: 6px;
    font-size: 14px;
    line-height: 16px;
  }
`;
const ShareTitle = styled.div`
  padding-left: 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  width: 100%;
  color: ${(props) => props.theme.palette.text?.primary};
`;

const MorePopup: React.FC<MoreOperateType> = (props) => {
  const user = useAppSelector((state) => state.user);
  const isMyPaper = useMemo(
    () => user.uid === props.paper?.authorId,
    [props.paper?.authorId, user.uid]
  );
  const isMyMagazine = useMemo(
    () => user.uid === props.magazine?.id,
    [props.magazine?.id, user.uid]
  );

  /**
   * 处理分享
   * @param type
   */
  const handleShare = (type: string) => {
    let baseUrl = "";
    let url = "";
    if (props.moreType === "magazine") {
      baseUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}magazine/${props.magazine?.id}`;
    } else {
      baseUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}feed?magazine_id=${props.paper?.magazineId}&paper_id=${props.paper?.id}`;
    }
    baseUrl = encodeURIComponent(baseUrl);
    switch (type) {
      case "SMS":
        url = `sms:'';?&body=${baseUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer.php?u=${baseUrl}`;
        break;
      case "pinterest":
        url = `https://www.pinterest.com/pin/create/button/?url=${baseUrl}`;
        break;
      default:
        break;
    }
    window.open(url);
    props.onClose?.();
  };

  return (
    <StyledPopup
      open={props.open}
      onClose={props.onClose}
      position="bottom"
      onClickOverlay={props.onClose}
    >
      <Container>
        <TopContainer>
          {/*<ItemStyle>*/}
          {/*  <ReportIcon />*/}
          {/*  <span>Report</span>*/}
          {/*</ItemStyle>*/}
          {isMyMagazine || isMyPaper ? (
            <ItemStyle onClick={props.onDelete}>
              <DeleteIcon />
              <span>Delete</span>
            </ItemStyle>
          ) : null}
          {/*<ItemStyle>*/}
          {/*  <RecommendIcon />*/}
          {/*  <span>Recommend</span>*/}
          {/*</ItemStyle>*/}
        </TopContainer>
        <ShareTitle>Share to</ShareTitle>
        <BottomContainer>
          <ItemStyle onClick={() => handleShare("SMS")}>
            <SmsIcon />
            <span>SMS</span>
          </ItemStyle>
          {/* <ItemStyle>
          <InsIcon />
          <span>Ins</span>
        </ItemStyle> */}
          <ItemStyle onClick={() => handleShare("facebook")}>
            <FacebookIcon />
            <span>Facebook</span>
          </ItemStyle>
          <ItemStyle onClick={() => handleShare("pinterest")}>
            <PinterestIcon />
            <span>Pinterest</span>
          </ItemStyle>
          {/* <ItemStyle>
          <CopyIcon />
          <span>copy link</span>
        </ItemStyle> */}
        </BottomContainer>
      </Container>
    </StyledPopup>
  );
};

export default MorePopup;
