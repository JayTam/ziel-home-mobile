import { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";
import Button from "../../../lib/Button";
import { ClickableMixin } from "../../../lib/mixins";
import { logoutAsync } from "../../app/features/user/userSlice";
import { useAppDispatch } from "../../app/hook";
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
  justify-content: space-between;
`;
const TopContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const BottomContainer = styled.div`
  width: 100%;
  height: 100%;
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
const LogOut = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px 14px 20px 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const LogOutButton = styled(Button)`
  width: 100%;
  height: 49px;
`;
const UserSetting: NextPage<SettingType> = () => {
  const dispatch = useAppDispatch();
  const handleLogOut = async () => {
    //登出
    dispatch(logoutAsync());
  };
  return (
    <Container>
      <TopContainer>
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
      </TopContainer>
      <BottomContainer>
        <LogOut>
          <LogOutButton onClick={handleLogOut} color={"default"}>
            Log Out
          </LogOutButton>
        </LogOut>
      </BottomContainer>
    </Container>
  );
};
export default UserSetting;
