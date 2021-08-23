import { MagazineType } from "../../apis";
import styled from "styled-components";
import SubscribeIcon from "../../assets/icons/icon_subscribe.svg";

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const MagazineContent = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0px 6px 8px 0px;
`;
const MagazinePoster = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 14px;
`;
const SubscribeLayout = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
`;
const SubscribeCount = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.text?.secondary};
`;
const MagazineName = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 6px;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const PickCount = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 4px;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => props.theme.palette.text?.primary};
`;
const MagazinePreview: React.FC<MagazineType> = () => {
  return (
    <Container>
      <MagazineContent>
        <MagazinePoster />
        <SubscribeLayout>
          <SubscribeIcon />
          <SubscribeCount></SubscribeCount>
        </SubscribeLayout>
      </MagazineContent>
      <MagazineName></MagazineName>
      <PickCount></PickCount>
    </Container>
  );
};

export default MagazinePreview;
