import { NextPage } from "next";
import Image from "next/image";
import styled from "styled-components";
import BgImg from "../assets/imgs/Mask Group.png";
import AleftIcon from "../assets/icons/aleft.svg";
import FreeTrialIcon from "../assets/imgs/free trial.png";
import AddressIcon from "../assets/icons/your address.svg";
import HelpIcon from "../assets/icons/help & support.svg";
import SettingIcon from "../assets/icons/setting.svg";
import { useAppSelector, useAppDispatch } from "../app/hook";
import Button from "../../lib/Button";
import { ClickableMixin } from "../../lib/mixins";
import { logoutAsync } from "../app/features/user/userSlice";
import BottomTabBar from "../components/BottomTabBar";

interface UserProps {
  name: string;
}
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderLayout = styled.div`
  position: relative;
  width: 100%;
`;
const HeaderBg = styled(Image)`
  width: 100vw;
`;
const HeaderContent = styled.div`
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PersonalContent = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  justify-content: space-between;
  padding: 0px 14px 14px 14px;
`;
const UserContent = styled.div`
  display: flex;
  align-items: center;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;
const UserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const RegisterTime = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const ProfileEntry = styled.div`
  display: flex;
  align-items: center;
  margin-left: 41px;
  visibility: hidden;
`;
const ProfileText = styled.div`
  color: ${(props) => props.theme.palette.text?.secondary};
  font-size: 14px;
  line-height: 16px;
`;
const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const ListItem = styled.div`
  height: 50px;
  width: 100vw;
  padding-left: 14px;
  display: flex;
  align-items: center;
  ${ClickableMixin}
`;
const ItemText = styled.div`
  color: ${(props) => props.theme.palette.text?.primary};
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  margin-left: 16px;
`;
const UserAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
const LogOut = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px 14px 70px 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const LogOutButton = styled(Button)`
  width: 100%;
  height: 49px;
`;
const FreeTrial = styled.div`
  width: 24px;
  height: 24px;
`;
const FreeTrialImg = styled(Image)``;
const Personal: NextPage<UserProps> = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const getRegistTime = (time: string) => {
    const currentTime = Number(new Date().valueOf());
    const registerTime = Number(new Date(time).valueOf());
    const days = (currentTime - registerTime) / 1000 / 60 / 60 / 24;
    return days.toFixed(0);
  };
  const handleFreeTrial = () => {
    console.log("click free trial");
  };

  const handleLogOut = async () => {
    //登出
    dispatch(logoutAsync());
  };

  return (
    <>
      <Container>
        <HeaderLayout>
          <HeaderBg src={BgImg} />
          <HeaderContent>
            <PersonalContent>
              <UserContent>
                <UserAvatar src={user.avatar} />
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <RegisterTime>{getRegistTime(user.created_at)} day in ziel home</RegisterTime>
                </UserInfo>
              </UserContent>
              <ProfileEntry>
                <ProfileText>Your profile</ProfileText>
                <AleftIcon />
              </ProfileEntry>
            </PersonalContent>
          </HeaderContent>
        </HeaderLayout>
        <MenuList>
          <ListItem onClick={handleFreeTrial}>
            <FreeTrial>
              <FreeTrialImg src={FreeTrialIcon} unoptimized />
            </FreeTrial>
            <ItemText>Free trial</ItemText>
          </ListItem>
          <ListItem>
            <AddressIcon />
            <ItemText>Your address</ItemText>
          </ListItem>
          <ListItem>
            <HelpIcon />
            <ItemText>Help & Support</ItemText>
          </ListItem>
          <ListItem>
            <SettingIcon />
            <ItemText>Setting</ItemText>
          </ListItem>
        </MenuList>
        <LogOut>
          <LogOutButton onClick={handleLogOut} color={"default"}>
            Log Out
          </LogOutButton>
        </LogOut>
        <BottomTabBar />
      </Container>
    </>
  );
};

export default Personal;
