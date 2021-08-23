import React from "react";
import styled from "styled-components";
import { MagazineType } from "../../apis";
import { TextEllipsisMixin } from "../../../lib/mixins";

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

const MagazineCover = styled.img<{ active?: boolean }>`
  width: 100%;
  height: 226px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
  border: ${(props) => `2px solid ${props.active ? props.theme.palette.primary : "transparent"}`};
`;

const MagazineTitle = styled.h2`
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
  font-size: 12px;
  line-height: 14px;
  ${TextEllipsisMixin}
`;

const Avatar = styled.img`
  width: 20px;
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
      <MagazineCover src={props.cover} alt="cover" active={props.active} />
      <MagazineTitle>{props.title}</MagazineTitle>
      <Row>
        <AuthorContainer>
          <Avatar src={props.avatar} alt="avatar" />
          <AuthorName>{props.author}</AuthorName>
        </AuthorContainer>
        <SubscribeNum>{props.subscribeNum} picks</SubscribeNum>
      </Row>
    </Container>
  );
};

export default MagazinePreview;