import { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";
import { ClickableMixin } from "../../../lib/mixins";
import Right from "../../assets/icons/right.svg";
import Hearder from "../../components/Header";

interface SettingType {
  userId: string;
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SettingItem = styled.div`
  width: 100%;
  padding: 17px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${ClickableMixin}
`;
const ItemTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const SplitDiv = styled.div`
  height: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.palette.background?.paper};
`;
const UserSetting: NextPage<SettingType> = () => {
  return (
    <Container>
      <Hearder>Account</Hearder>
      <SettingItem>
        <ItemTitle>Edit Profile</ItemTitle>
        <Right />
      </SettingItem>
      <SettingItem>
        <ItemTitle>Account Security</ItemTitle>
        <Right />
      </SettingItem>
      <SplitDiv />
      <SettingItem>
        <ItemTitle>Help & Feedback</ItemTitle>
        <Right />
      </SettingItem>
      <Link href={"/setting/about/"}>
        <SettingItem>
          <ItemTitle>About</ItemTitle>
          <Right />
        </SettingItem>
      </Link>
    </Container>
  );
};
export default UserSetting;
