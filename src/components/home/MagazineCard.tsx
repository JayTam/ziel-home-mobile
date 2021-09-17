import React, { MouseEventHandler, useMemo, useRef } from "react";
import styled from "styled-components";
import { MagazineType } from "@/apis";
import { TextEllipsisMixin } from "#/lib/mixins";
import SubscribeSvgIcon from "@/assets/icons/explore-subscribe.svg";
// import SubscribedSvgIcon from "@/assets/icons/explore-subscribed.svg";

import { digitalScale, randomInt } from "@/utils";
import { useAppSelector } from "@/app/hook";
import Image from "#/lib/Image";
import { useRouter } from "next/router";

const Container = styled.div<{ color: string }>`
  width: 315px;
  height: 477px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: ${(props) => props.theme.palette.common?.white};
  background-color: ${(props) => props.color};
  padding: 14px 52px 24px 52px;
  border-radius: 20px;
  margin-bottom: 36px;
  box-shadow: 0 4px 20px 0 #00000033;
  @media (max-width: 374px) {
    width: 280px;
  }
  @media (max-width: 300px) {
    width: 260px;
  }
`;

const AuthorContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 14px;
`;
const Avatar = styled(Image)`
  min-width: 24px;
  max-width: 24px;
  width: 24px;
  border-radius: 999px;
`;
const AuthorName = styled.p`
  font-size: 14px;
  line-height: 16px;
  margin-left: 4px;
`;

const MagazineCover = styled(Image)`
  border-radius: 10px;
  margin-bottom: 10px;
`;

const MagazineTitle = styled.p`
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 2px;
  font-family: "DidotBold", serif;
  ${TextEllipsisMixin}
`;

const MagazineNunContainer = styled.p`
  font-size: 14px;
  line-height: 16px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
`;

const SubscribeButton = styled.div<{ isSubscribe: boolean }>`
  position: relative;
  height: 60px;
  width: 100%;
`;

const SubscribeButtonBg = styled.div<{ isSubscribe: boolean }>`
  transition: all 0.3s ease 0.2s;
  position: absolute;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: ${(props) => (props.isSubscribe ? "60px" : "100%")};
  background: rgba(51, 51, 51, 0.5);
  border-radius: 999px;
`;

const SubscribeButtonText = styled.p<{ isSubscribe: boolean }>`
  transition: all 0.3s ease 0.2s;
  opacity: ${(props) => (props.isSubscribe ? "0" : "1")};
  position: absolute;
  top: 50%;
  left: calc(50% - 10px);
  transform: translate(-50%, -50%);
`;

const SubscribeIcon = styled(SubscribeSvgIcon)<{ subscribed: boolean }>`
  transition: all 0.3s ease 0.2s;
  position: absolute;
  top: 50%;
  right: ${(props) => (props.subscribed ? "50%" : "8px")};
  transform: ${(props) =>
    props.subscribed ? "translate(50%, -50%) rotate(0);" : "translate(0, -50%) rotate(360deg);"};
  background: rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
`;

const MAGAZINE_CARD_COLOR_LIST = [
  "#A4907A",
  "#6D6D6D",
  "#CC9268",
  "#729AD6",
  "#77CA93",
  "#ABA59D",
  "#D6BD7F",
  "#C89A79",
  "#5FDAA6",
  "rgba(180, 169, 132, 0.988)",
  "#91AF91",
  "#898989",
  "#D98377",
  "#AEC787",
  "#81B5D2",
  "rgba(223, 126, 167, 0.967)",
  "rgba(233, 136, 136, 0.94)",
  "#A581D2",
  "#7DD5CF",
  "rgba(166, 168, 68, 0.94)",
];

function randomColor(): string {
  const len = MAGAZINE_CARD_COLOR_LIST.length;
  const index = randomInt(0, len - 1);
  return MAGAZINE_CARD_COLOR_LIST[index];
}

interface MagazineCardProps extends MagazineType {
  onSubscribe?: () => void;
  onClick?: () => void;
}

const MagazineCard: React.FC<MagazineCardProps> = (props) => {
  const router = useRouter();
  const backgroundColor = useRef(randomColor());
  const user = useAppSelector((state) => state.user);
  const isMyMagazine = useMemo(() => user.uid === props.authorId, [props.authorId, user.uid]);
  const handleSubscribe: MouseEventHandler = (event) => {
    event.stopPropagation();
    props.onSubscribe?.();
  };

  const toProfileRoute: MouseEventHandler = (event) => {
    event.stopPropagation();
    router.push(`/profile/${props.authorId}`);
  };

  const toMagazineRoute: MouseEventHandler = (event) => {
    event.stopPropagation();
    router.push(`/magazine/${props.id}`);
  };

  return (
    <Container color={backgroundColor.current} onClick={props.onClick}>
      <AuthorContainer onClick={toProfileRoute}>
        <Avatar src={props.avatar} width={24} height={24} />
        <AuthorName> {props.author} </AuthorName>
      </AuthorContainer>
      <MagazineCover src={props.cover} height={280} width={210} blur fit="cover" />
      <MagazineTitle onClick={toMagazineRoute}>{props.title}</MagazineTitle>
      <MagazineNunContainer onClick={toMagazineRoute}>
        {digitalScale(props.subscribeNum)} subscribers · {digitalScale(props.paperNum)} stories
      </MagazineNunContainer>
      {isMyMagazine ? null : (
        <SubscribeButton isSubscribe={props.isSubscribe}>
          <SubscribeButtonBg isSubscribe={props.isSubscribe} onClick={handleSubscribe} />
          <SubscribeButtonText isSubscribe={props.isSubscribe} onClick={handleSubscribe}>
            subscribe
          </SubscribeButtonText>
          <SubscribeIcon subscribed={props.isSubscribe} onClick={handleSubscribe} />
        </SubscribeButton>
      )}
    </Container>
  );
};

export default MagazineCard;
