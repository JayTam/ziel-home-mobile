import { NextPage } from "next";
import styled from "styled-components";
import Header from "../../components/Header";
import LogoImage from "../../assets/imgs/logo2.png";
import TopImage from "../../assets/imgs/banner2.png";
import Image from "next/image";
import ContentBg from "../../../public/Mask Group.png";
import SongmicsLogo from "../../assets/imgs/logo3.png";
import VasagleLogo from "../../assets/imgs/logo4.png";
import FeanareaLogo from "../../assets/imgs/logo5.png";
import { Parallax } from "react-parallax";

interface AboutType {
  id: string;
}
const Container = styled.div`
  width: 100%;
  height: 100vh;
`;
const Title = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
  & img {
    margin: auto 0%;
    width: 71px;
    height: 15px;
  }
`;
const TopContent = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    width: 99px;
    height: 23px;
  }
`;
const TopContentText = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin-right: 14px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const MiddleContent = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 28px 20px;
`;
const MiddleContentText = styled.div`
  display: flex;
  flex-direction: column;
  & span {
    font-weight: 500;
    font-size: 40px;
    line-height: 47px;
    color: ${(props) => props.theme.palette.text?.primary};
  }
`;
const SplitDiv = styled.div`
  width: 100%;
  min-height: 300px;
  background-color: ${(props) => props.theme.palette.primary};
  padding: 34px 65px 34px 20px;
  & span {
    font-weight: 500;
    font-size: 16px;
    line-height: 180%;
    color: ${(props) => props.theme.palette.common?.white};
  }
`;
const LogoImg = styled(Image)`
  height: 100%;
`;
const TopBgStyle = styled.div`
  height: 200px;
  position: relative;
  & div {
    height: 100%;
  }
`;
const TopBgImg = styled(Image)`
  height: 100%;
`;
const TopBgTitle = styled.div`
  padding: 30px 20px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  & span {
    font-weight: 500;
    font-size: 40px;
    line-height: 47px;
    color: white;
  }
`;
const BackGoundImg = styled.div`
  height: 300px;
`;
const VideoStyle = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;
const VideoContent = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Description = styled.div`
  padding: 0 20px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: ${(props) => props.theme.palette.common?.white};
  & span {
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
`;
const BottomLogoStyle = styled.div`
  width: 100%;
  min-height: 300px;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const BottomTitle = styled.div`
  font-weight: 500;
  font-size: 30px;
  line-height: 35px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const SongmicsStyle = styled.div`
  margin-top: 10px;
  width: 160px;
  height: 15px;
`;
const VasagleStyle = styled.div`
  width: 130px;
  height: 24px;
`;
const FeanareaStyle = styled.div`
  width: 129px;
  height: 24px;
`;
const SongmicsImage = styled(Image)``;
const VasagleImage = styled(Image)``;
const FeanareaImage = styled(Image)``;
const About: NextPage<AboutType> = () => {
  return (
    <Container>
      <Header shadow>
        <Title>
          <LogoImg src={LogoImage} />
        </Title>
      </Header>
      <TopContent>
        <TopContentText>The Story of </TopContentText>
        <LogoImg src={LogoImage} />
      </TopContent>
      <TopBgStyle>
        <TopBgImg src={TopImage} />
        <TopBgTitle>
          <span>About</span>
          <span>Ziel Home</span>
          <span>Community</span>
        </TopBgTitle>
      </TopBgStyle>
      <Parallax
        bgImage={ContentBg.src}
        strength={300}
        bgImageStyle={{ objectFit: "contain", width: "100%" }}
      >
        <BackGoundImg />
      </Parallax>

      <MiddleContent>
        <MiddleContentText>
          <span>What do</span>
          <span>we have</span>
        </MiddleContentText>
      </MiddleContent>
      <SplitDiv>
        <span>
          In the Ziel Home Community, we offer a variety of special activities and content to bring
          you the most fun and entertainment.
        </span>
        <br></br>
        <br></br>
        <br></br>
        <span>
          Also our community will bring you like-minded friends while also offering you exclusive
          gifts from us.
        </span>
      </SplitDiv>
      <VideoStyle>
        <VideoContent
          autoPlay
          loop
          muted
          src={
            "https://tcloud-public.oss-cn-hongkong.aliyuncs.com/community/1407593398399664128/4a33361c-1bda-4e53-878c-014922629dfd.mp4?X_PP_Audience%3D1407593398399664128%26X_PP_ExpiredAt%3D1624445974%26X_PP_GrantedAt%3D1624445974%26X_PP_Method%3D%2A%26X_PP_ObjectName%3Dcommunity%2F1407593398399664128%2F4a33361c-1bda-4e53-878c-014922629dfd.mp4%26X_PP_Owner%3D1407593398399664128%26X_PP_ResourceType%3Dcommunity%26X_PP_Signature%3D04da165c16edd26c29a46626c02f7f3b"
          }
        ></VideoContent>
        <Description>
          What can you do
          <br></br>
          <br></br>
          <span>
            {
              "From sharing your home decor and furnitures ideas to snippets of your lifestyle, you can share anything from your life and create compelling content that distinctly yours."
            }
          </span>
        </Description>
      </VideoStyle>
      <BottomLogoStyle>
        <BottomTitle>Our Brands</BottomTitle>
        <SongmicsStyle>
          <SongmicsImage src={SongmicsLogo} />
        </SongmicsStyle>
        <VasagleStyle>
          <VasagleImage src={VasagleLogo} />
        </VasagleStyle>
        <FeanareaStyle>
          <FeanareaImage src={FeanareaLogo} />
        </FeanareaStyle>
      </BottomLogoStyle>
    </Container>
  );
};
export default About;
