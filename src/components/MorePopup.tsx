import React, { useMemo } from "react";
import styled from "styled-components";
import RecommendIcon from "@/assets/icons/recommend.svg";
import UnRecommendIcon from "@/assets/icons/unrecommend.svg";
import DeleteIcon from "@/assets/icons/more-operate-delete.svg";
import SmsIcon from "@/assets/icons/sms.svg";
import PinterestIcon from "@/assets/icons/Pinterest.svg";
import UnStarIcon from "@/assets/icons/unstar.svg";
import StaredIcon from "@/assets/icons/stared.svg";
// import CopyIcon from "@/assets/icons/copy.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
// import HiddenIcon from "@/assets/icons/hidden.svg";
// import ShowIcon from "@/assets/icons/show.svg";
// import InsIcon from "@/assets/icons/ins.svg";
import { MagazineType } from "@/apis";
import { PaperType } from "@/apis/paper";
import Popup from "#/lib/Popup";
import { useAppSelector } from "@/app/hook";
import { useRouter } from "next/router";

interface MoreOperateType {
  open: boolean;
  magazine?: MagazineType;
  paper?: PaperType;
  moreType: "paper" | "magazine";
  onDelete?: () => void;
  onTop?: () => void;
  onStar?: () => void;
  onClose?: () => void;
  onHidden?: () => void;
}

const StyledPopup = styled(Popup)`
  padding: 0;
  margin: 0;
  border-radius: 20px 20px 0 0;
`;
const Container = styled.div`
  padding: 30px 0 30px 0;
`;
const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;

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
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const BottomContainer = styled.div`
  padding: 14px 4px 0 0;
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
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const isMyPaper = useMemo(
    () => user.uid === props.paper?.authorId,
    [props.paper?.authorId, user.uid]
  );
  const isMyMagazine = useMemo(
    () => user.uid === props.paper?.magazine?.authorId,
    [props.paper?.magazine?.authorId, user.uid]
  );

  /**
   * 处理分享
   * @param type
   */
  const handleShare = (type: string) => {
    let shareUrl: string;
    let url = "";
    if (props.moreType === "magazine") {
      shareUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}magazine/${props.magazine?.id}?from=${router.asPath}`;
    } else {
      shareUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}feed?magazine_id=${props.paper?.magazineId}&paper_id=${props.paper?.id}&from=${router.asPath}`;
    }
    shareUrl = encodeURIComponent(shareUrl);
    switch (type) {
      case "SMS":
        url = `sms:'';?&body=${shareUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer.php?u=${shareUrl}`;
        break;
      case "pinterest":
        url = `https://www.pinterest.com/pin/create/button/?url=${shareUrl}`;
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
        {props.moreType === "paper" ? (
          <TopContainer>
            {/* 收藏内容，所有人均可收藏 */}
            <ItemStyle onClick={props.onStar}>
              {props.paper?.isStar ? <StaredIcon /> : <UnStarIcon />}
              <span>{props.paper?.isStar ? "UnCollect" : "Collect"}</span>
            </ItemStyle>
            {/* 只有杂志拥有者，才能推荐/置顶 */}
            {isMyMagazine ? (
              <ItemStyle onClick={props.onTop}>
                {props.paper?.isTop ? <UnRecommendIcon /> : <RecommendIcon />}
                <span>{props.paper?.isTop ? "Unrecommend" : "Recommend"}</span>
              </ItemStyle>
            ) : null}
            {/* TODO:// 暂时不需要了，内容创建者，才可以隐藏显示 */}
            {/*{isMyPaper ? (*/}
            {/*  <ItemStyle onClick={props.onHidden}>*/}
            {/*    {props.paper?.isHidden ? <ShowIcon /> : <HiddenIcon />}*/}
            {/*    <span> {props.paper?.isHidden ? "Public" : "Hidden"} </span>*/}
            {/*  </ItemStyle>*/}
            {/*) : null}*/}
            {/* 杂志拥有者和内容创建者，可以删除 */}
            {isMyMagazine || isMyPaper ? (
              <ItemStyle onClick={props.onDelete}>
                <DeleteIcon />
                <span>Delete</span>
              </ItemStyle>
            ) : null}
          </TopContainer>
        ) : null}
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
