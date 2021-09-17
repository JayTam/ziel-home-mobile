import React from "react";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import { VerticalHorizontalCenterMixin } from "#/lib/mixins";
import MorePaperIcon from "@/assets/icons/more-paper.svg";
import Link from "next/link";
import ShowMoreText from "react-show-more-text";
import Image from "#/lib/Image";

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
const MagazineCover = styled(Image)`
  border-radius: 8px;
  box-shadow: 0 2px 10px 0 #00000033;
  ${VerticalHorizontalCenterMixin}
`;
const MagazineInfoContainer = styled.div`
  padding-bottom: 14px;
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
  font-weight: 300;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;

const PapersContainer = styled.div`
  padding-left: 68px;
  padding-right: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 224px;
  overflow-x: scroll;
  overflow-y: hidden;
  margin-bottom: 20px;
  white-space: nowrap;
`;
const PaperItem = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 6px;
  border-radius: 8px;
  overflow: hidden;
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
const PaperTitle = styled(ShowMoreText)`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 5px;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.common?.white};
`;

type SubscribeMagazinePreviewProps = MagazineType;

const SubscribeMagazinePreview: React.FC<SubscribeMagazinePreviewProps> = (props) => {
  return (
    <Container>
      <Link href={`/magazine/${props.id}`}>
        <MagazineContainer>
          <MagazineCoverContainer>
            <MagazineCoverBackground />
            <MagazineCover src={props.cover} width={60} height={80} loading />
          </MagazineCoverContainer>
          <MagazineInfoContainer>
            <MagazineTitle>{props.title}</MagazineTitle>
            <MagazineCreateTime>{props.updatedAt}</MagazineCreateTime>
          </MagazineInfoContainer>
        </MagazineContainer>
      </Link>

      <PapersContainer>
        {props.papers?.map((paper) => (
          <Link href={`/feed?paper_id=${paper.id}&type=subscribe`} key={paper.id}>
            <PaperItem>
              <Image src={paper.poster} width={120} height={214} loading />
              <PaperTitle width={110} anchorClass="anchor" lines={2} more={null} less={null}>
                {paper.title}
              </PaperTitle>
            </PaperItem>
          </Link>
        ))}
        <Link href={`/feed?magazine_id=${props.id}`}>
          <PaperMore>
            <PaperMoreIcon />
          </PaperMore>
        </Link>
      </PapersContainer>
    </Container>
  );
};

export default SubscribeMagazinePreview;
