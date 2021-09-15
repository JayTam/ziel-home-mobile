import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useAppSelector } from "@/app/hook";
import { ClickableMixin, TextEllipsisMixin } from "#/lib/mixins";
import BottomTabBar from "@/components/BottomTabBar";
import BgImg from "@/assets/imgs/Mask Group.png";
import AleftIcon from "@/assets/icons/aleft.svg";
import FreeTrialIcon from "@/assets/imgs/free trial.png";
import AddressIcon from "@/assets/icons/your address.svg";
import HelpIcon from "@/assets/icons/help & support.svg";
import SettingIcon from "@/assets/icons/setting.svg";

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
  height: 156px;
  background-size: 100% 100%;
  background-image: url("${BgImg.src}");
`;
// const HeaderBg = styled(Image)`
//   width: 100vw;
// `;
const HeaderContent = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PersonalContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 30px;
  padding: 0px 14px 14px 14px;
`;
const UserInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  ${TextEllipsisMixin}
`;
const UserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.primary};
  ${TextEllipsisMixin}
`;
const RegisterTime = styled.div`
  font-size: 14px;
  line-height: 16px;
  margin-top: 6px;
  color: #666666;
`;
const ProfileEntry = styled.div`
  display: flex;
  align-items: center;
  width: 88px;
  max-width: 88px;
  min-width: 88px;
`;
const ProfileText = styled.div`
  color: #666666;
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
  min-width: 80px;
  max-width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const FreeTrial = styled.div`
  width: 24px;
  height: 24px;
`;
const FreeTrialImg = styled(Image)``;
const Personal: NextPage<UserProps> = () => {
  const user = useAppSelector((state) => state.user);
  const PAPER_PROFILE_ROUTE = `/profile/${user.uid}`;
  const getRegistTime = (time: string) => {
    const currentTime = Number(new Date().valueOf());
    const registerTime = Number(new Date(time).valueOf());
    const days = (currentTime - registerTime) / 1000 / 60 / 60 / 24;
    return days.toFixed(0);
  };
  const handleFreeTrial = () => {
    console.log("click free trial");
  };

  return (
    <>
      <Container>
        <HeaderLayout>
          {/* <HeaderBg src={BgImg} /> */}
          <HeaderContent>
            <PersonalContent>
              <UserAvatar src={user.avatar} />
              <UserInfo>
                <UserName>{user.name}</UserName>
                <RegisterTime>{getRegistTime(user.created_at)} day in ziel home</RegisterTime>
              </UserInfo>
              <ProfileEntry>
                <Link href={PAPER_PROFILE_ROUTE}>
                  <ProfileText>Your profile</ProfileText>
                </Link>
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
          <ListItem
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_PAASPORT_URL}/address_book`;
            }}
          >
            <AddressIcon />
            <ItemText>Your address</ItemText>
          </ListItem>
          <ListItem>
            <HelpIcon />
            <ItemText>Help & Support</ItemText>
          </ListItem>
          <Link href={"/setting/userSetting/"}>
            <ListItem>
              <SettingIcon />
              <ItemText>Setting</ItemText>
            </ListItem>
          </Link>
        </MenuList>
        <BottomTabBar />
      </Container>
    </>
  );
};

export default Personal;
