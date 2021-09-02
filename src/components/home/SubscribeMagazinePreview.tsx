import React from "react";
import styled from "styled-components";
import { MagazineType } from "../../apis";
import { TextEllipsisMixin, VerticalHorizontalCenterMixin } from "../../../lib/mixins";
import DefaultPaperPoster from "../../../public/video_placeholder.jpg";
import MorePaperIcon from "../../assets/icons/more-paper.svg";
import Link from "next/link";

const Container = styled.div`
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 25px;
`;
const MagazineContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 14px;
`;
const MagazineCoverContainer = styled.div`
  position: relative;
  width: 60px;
  height: 90px;
`;
const MagazineCoverBackground = styled.div`
  width: 50px;
  height: 90px;
  background: #eeeeee;
  border-radius: 8px;
  ${VerticalHorizontalCenterMixin}
`;
const MagazineCover = styled.img`
  width: 60px;
  height: 80px;
  border-radius: 8px;
  ${VerticalHorizontalCenterMixin}
`;
const MagazineInfoContainer = styled.div`
  margin-left: 8px;
`;
const MagazineTitle = styled.p`
  font-size: 18px;
  line-height: 23px;
  font-weight: 500;
  font-family: "DidotBold", serif;
`;
const MagazineCreateTime = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;

const PapersContainer = styled.div`
  padding-left: 68px;
  padding-right: 20px;
  box-sizing: border-box;
  width: calc(100% + 14px);
  height: 224px;
  overflow-x: scroll;
  overflow-y: hidden;
  margin-bottom: 20px;
  white-space: nowrap;
`;
const PaperItem = styled.div<{ cover: string }>`
  position: relative;
  display: inline-block;
  margin-right: 6px;
  width: 120px;
  height: 214px;
  background-size: cover;
  border-radius: 4px;
  background-image: url("${(props) => props.cover || DefaultPaperPoster.src}");
`;

const PaperMore = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 214px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const PaperMoreIcon = styled(MorePaperIcon)`
  ${VerticalHorizontalCenterMixin}
`;
const PaperTitle = styled.p`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 5px;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.palette.common?.white};
  ${TextEllipsisMixin}
`;

type SubscribeMagazinePreviewProps = MagazineType;

const SubscribeMagazinePreview: React.FC<SubscribeMagazinePreviewProps> = (props) => {
  return (
    <Container>
      <Link href={`/magazine/${props.id}`}>
        <MagazineContainer>
          <MagazineCoverContainer>
            <MagazineCoverBackground />
            <MagazineCover src={props.cover} />
          </MagazineCoverContainer>
          <MagazineInfoContainer>
            <MagazineTitle>{props.title}</MagazineTitle>
            <MagazineCreateTime>{props.updatedAt}</MagazineCreateTime>
          </MagazineInfoContainer>
        </MagazineContainer>
      </Link>

      <PapersContainer>
        {props.papers?.map((paper, index) => (
          <Link href={`/feed?magazine_id=${props.id}&active_index=${index}`} key={paper.id}>
            <PaperItem cover={paper.poster}>
              <PaperTitle>{paper.title}</PaperTitle>
            </PaperItem>
          </Link>
        ))}
        <Link href={`/feed?magazine_id=${props.id}&active_index=3`}>
          <PaperMore>
            <PaperMoreIcon />
          </PaperMore>
        </Link>
      </PapersContainer>
    </Container>
  );
};

export default SubscribeMagazinePreview;
