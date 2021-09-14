import { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import styled from "styled-components";
import Button from "#/lib/Button";
import { ClickableMixin } from "#/lib/mixins";
import Popup from "#/lib/Popup";
import { logoutAsync } from "@/app/features/user/userSlice";
import { useAppDispatch } from "@/app/hook";
import Header from "@/components/Header";
import Right from "@/assets/icons/right.svg";

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
const LogoutPopup = styled(Popup)`
  width: 100%;
  height: 150px;
  border-radius: 20px 20px 0 0;
  padding: 0;
  div {
    height: 50px;
    width: 100%;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.palette.text?.secondary};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div:nth-of-type(n + 2) {
    ${ClickableMixin}
  }
  div:nth-of-type(2) span {
    font-weight: 500;
    color: ${(props) => props.theme.palette.text?.primary};
  }
  div:nth-of-type(3) {
    height: 0px;
    width: calc(100% - 28px);
    margin-left: 14px;
    border: 1px solid ${(props) => props.theme.palette.background?.paper};
    span {
      font-size: 12px;
      line-height: 50px;
    }
  }
`;
const UserSetting: NextPage<SettingType> = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const dispatch = useAppDispatch();
  const showLogout = () => {
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const handleLogOut = async () => {
    //登出
    dispatch(logoutAsync());
  };
  return (
    <>
      <Container>
        <TopContainer>
          <Header>Account</Header>
          <SettingItem
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_PAASPORT_URL}/profiles`;
            }}
          >
            <ItemTitle>Edit Profile</ItemTitle>
            <Right />
          </SettingItem>
          <SettingItem
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_PAASPORT_URL}/account_security`;
            }}
          >
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
            <LogOutButton onClick={showLogout} color={"default"}>
              Log Out
            </LogOutButton>
          </LogOut>
        </BottomContainer>
      </Container>
      <LogoutPopup onClickOverlay={closePopup} open={popupOpen} position="bottom">
        <div>
          <span>Whether to log out of the current account？</span>
        </div>
        <div onClick={handleLogOut}>
          <span>Log out</span>
        </div>
        <div />
        <div onClick={closePopup}>
          <span>cancel</span>
        </div>
      </LogoutPopup>
    </>
  );
};
export default UserSetting;
