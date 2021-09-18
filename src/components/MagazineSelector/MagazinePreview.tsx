import React from "react";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import { TextEllipsisMixin } from "#/lib/mixins";
import Image from "#/lib/Image";

interface MagazinePreviewProps extends MagazineType {
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-direction: column;
`;

const MagazineCover = styled(Image)<{ active?: boolean }>`
  width: 100%;
  padding-top: 132%;
  border-radius: 8px;
  margin-bottom: 10px;
  border: ${(props) => `2px solid ${props.active ? props.theme.palette.primary : "transparent"}`};
`;

const MagazineTitle = styled.h2`
  font-family: "DidotBold", serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 4px;
  ${TextEllipsisMixin}
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.palette.text?.secondary};
  font-weight: normal;
`;

const AuthorContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 60%;
`;

const AuthorName = styled.p`
  margin-left: 8px;
  font-size: 12px;
  line-height: 14px;
  ${TextEllipsisMixin}
`;

const Avatar = styled(Image)`
  width: 20px;
  min-width: 20px;
  max-width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 999px;
`;

const SubscribeNum = styled.div`
  font-size: 12px;
  line-height: 14px;
`;

const MagazinePreview: React.FC<MagazinePreviewProps> = (props) => {
  return (
    <Container className={props.className} onClick={props.onClick}>
      <MagazineCover
        src={props.cover}
        alt="cover"
        active={props.active}
        fit="cover"
        resizeOptions={{ w: 170, h: 226 }}
        zoomOptions={{ w: 100, h: 130 }}
      />
      <MagazineTitle>{props.title}</MagazineTitle>
      <Row>
        <AuthorContainer>
          <Avatar src={props.avatar} width={20} height={20} alt="avatar" />
          <AuthorName>{props.author}</AuthorName>
        </AuthorContainer>
        <SubscribeNum>{props.subscribeNum} picks</SubscribeNum>
      </Row>
    </Container>
  );
};

export default MagazinePreview;
