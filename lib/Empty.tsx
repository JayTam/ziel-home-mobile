import React from "react";
import styled from "styled-components";
import EmptyMagazineIcon from "../src/assets/icons/empty/magazine.svg";
import EmptyDefaultIcon from "../src/assets/icons/empty/default.svg";

const Container = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const Title = styled.p`
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.palette.text?.primary};
  width: 100%;
  text-align: center;
  margin-top: -40px;
`;
const Description = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.palette.text?.secondary};
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

interface EmptyInterface {
  className?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  type?: "magazine" | "default";
}

const Empty: React.FC<EmptyInterface> = (props) => {
  return (
    <Container className={props.className}>
      {props.type === "magazine" ? <EmptyMagazineIcon /> : null}
      {props.type === "default" ? <EmptyDefaultIcon /> : null}
      <Title>{props.title}</Title>
      <Description>{props.description}</Description>
      {props.children}
    </Container>
  );
};

Empty.defaultProps = {
  type: "default",
};

export default Empty;
