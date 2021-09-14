import React from "react";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import SubscribeIcon from "@/assets/icons/popular-subscribed.svg";
import SubscribedIcon from "@/assets/icons/popular-subscribe.svg";

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 14px;
`;

const MagazineCoverContainer = styled.div`
  position: relative;
  flex-basis: 90px;
  height: 130px;
`;
const MagazineCoverBg = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 130px;
  background: #eeeeee;
  border-radius: 8px;
`;
const MagazineCover = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const MagazineInfoContainer = styled.div`
  padding: 10px;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
`;
const Title = styled.div`
  font-family: "DidotBold", serif;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 4px;
`;
const MagazineNum = styled.p`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 2px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const SubscribeNum = styled.p`
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 12px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const SubscribeButton = styled(SubscribeIcon)`
  align-self: flex-end;
`;

const SubscribedButton = styled(SubscribedIcon)`
  align-self: flex-end;
`;

interface PopularMagazinePreview extends MagazineType {
  onSubscribe?: () => void;
}

const PopularMagazinePreview: React.FC<PopularMagazinePreview> = (props) => {
  return (
    <Container>
      <MagazineCoverContainer>
        <MagazineCoverBg />
        <MagazineCover src={props.cover} />
      </MagazineCoverContainer>
      <MagazineInfoContainer>
        <Title>{props.title}</Title>
        <MagazineNum>{props.showNum} stories</MagazineNum>
        <SubscribeNum>{props.subscribeNum} subscribers</SubscribeNum>
        {props.isSubscribe ? (
          <SubscribeButton onClick={props.onSubscribe} />
        ) : (
          <SubscribedButton onClick={props.onSubscribe} />
        )}
      </MagazineInfoContainer>
    </Container>
  );
};

export default PopularMagazinePreview;
