import React from "react";
import styled from "styled-components";
import RecommendIcon from "../assets/icons/recommend.svg";
import DeleteIcon from "../assets/icons/more-operate-delete.svg";
import ReportIcon from "../assets/icons/report.svg";
import SaveIcon from "../assets/icons/save.svg";
import CollectionIcon from "../assets/icons/collection.svg";
import SmsIgon from "../assets/icons/sms.svg";
import PinterestIgon from "../assets/icons/Pinterest.svg";
import CopyIgon from "../assets/icons/copy.svg";
import FacebookIgon from "../assets/icons/facebook.svg";
import InsIgon from "../assets/icons/ins.svg";
import { MagazineType } from "../apis";

interface MoreOperateType extends MagazineType {
  onlyShare?: boolean;
}
const Container = styled.div`
  padding: 30px 0px;
`;
const TopContainer = styled.div`
  padding: 0 4px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 30px;

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
`;
const BottomContainer = styled.div`
  padding: 14px 4px 0 4px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
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
const MoreOperate: React.FC<MoreOperateType> = (props) => {
  const handleClick = (type: string) => {
    switch (type) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_WEB_BASE_URL}/magezine/${props.id}`
        );
        break;
      default:
        break;
    }
  };
  return (
    <Container>
      {props.onlyShare ? (
        ""
      ) : (
        <TopContainer>
          <ItemStyle>
            <SaveIcon />
            <span>Save</span>
          </ItemStyle>
          <ItemStyle>
            <ReportIcon />
            <span>Report</span>
          </ItemStyle>
          <ItemStyle>
            <DeleteIcon />
            <span>Delete</span>
          </ItemStyle>
          <ItemStyle>
            <RecommendIcon />
            <span>Recommend</span>
          </ItemStyle>
          <ItemStyle>
            <CollectionIcon />
            <span>Collection</span>
          </ItemStyle>
        </TopContainer>
      )}
      <ShareTitle>Share to</ShareTitle>
      <BottomContainer>
        <ItemStyle>
          <SmsIgon />
          <span>SMS</span>
        </ItemStyle>
        <ItemStyle>
          <InsIgon />
          <span>Ins</span>
        </ItemStyle>
        <ItemStyle onClick={() => handleClick("facebook")}>
          <FacebookIgon />
          <span>Facebook</span>
        </ItemStyle>
        <ItemStyle>
          <PinterestIgon />
          <span>Pinterest</span>
        </ItemStyle>
        <ItemStyle>
          <CopyIgon />
          <span>copy link</span>
        </ItemStyle>
      </BottomContainer>
    </Container>
  );
};

export default MoreOperate;
