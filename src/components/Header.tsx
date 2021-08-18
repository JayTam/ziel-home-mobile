import React from "react";
import styled from "styled-components";
import { VerticalCenterMixin, VerticalHorizontalCenterMixin } from "../../lib/mixins";
import BackIcon from "../assets/icons/back.svg";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 44px;
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
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <Container>
      <Left>{props.leftComponent ?? <BackIcon />}</Left>
      <Center>center</Center>
      {props.rightComponent ? <Right>{props.rightComponent}</Right> : null}
    </Container>
  );
};

export default Header;
