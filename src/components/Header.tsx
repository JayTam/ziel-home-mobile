import React from "react";
import styled from "styled-components";
import { VerticalCenterMixin, VerticalHorizontalCenterMixin } from "../../lib/mixins";
import BackIcon from "../assets/icons/back.svg";
import { useRouter } from "next/router";

const Container = styled.div<HeaderProps>`
  position: ${(props) => (props.fixed ? "fixed" : "relative")};
  background-color: ${(props) => props.color};
  width: 100%;
  height: 44px;
  z-index: 999;
`;

const Left = styled.div`
  left: 14px;
  font-size: 0;
  ${VerticalCenterMixin}
`;

const Center = styled.div`
  font-weight: 500;
  font-size: 17px;
  line-height: 20px;
  text-transform: capitalize;
  ${VerticalHorizontalCenterMixin}
`;

const Right = styled.div`
  right: 14px;
  font-size: 0;
  ${VerticalCenterMixin}
`;

interface HeaderProps {
  fixed?: boolean;
  color?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onBack?: () => void;
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = (props) => {
  const router = useRouter();

  const handleBack = () => {
    if (props.onBack) {
      props.onBack?.();
    } else {
      router.back();
    }
  };

  return (
    <Container fixed={props.fixed} color={props.color}>
      <Left>{props.leftComponent ?? <BackIcon onClick={handleBack} />}</Left>
      <Center>{props.children}</Center>
      {props.rightComponent ? <Right>{props.rightComponent}</Right> : null}
    </Container>
  );
};

Header.defaultProps = {
  color: "transparent",
  fixed: false,
};

export default Header;
