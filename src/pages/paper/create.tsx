import { NextPage } from "next";
import Header from "../../components/Header";
import styled from "styled-components";
import UploadFile from "../../../lib/UploadFile";
import { composeAuthHeaders } from "../../utils";
import Popup from "../../../lib/Popup";

const PageContainer = styled.div`
  padding: 20px 14px;
`;

const MagazineTitleInput = styled.input`
  display: block;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  color: ${(props) => props.theme.palette.text?.primary};
  font-size: 14px;
  line-height: 16px;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
  font-weight: 500;
  &:focus {
    outline: 0;
  }

  &::placeholder {
    font-weight: normal;
    color: ${(props) => props.theme.palette.text?.secondary};
  }
`;

const MagazineDescriptionInput = styled.textarea`
  display: block;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  color: ${(props) => props.theme.palette.text?.primary};
  font-size: 14px;
  line-height: 16px;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: ${(props) => props.theme.palette.text?.secondary};
  }
`;

const Divider = styled.div`
  margin: 14px 0;
  width: 100%;
  height: 1px;
  background-color: #f5f5f5;
`;

const StyledUploadFile = styled(UploadFile)`
  margin-bottom: 14px;
`;

const PaperCreate: NextPage = () => {
  const headers = composeAuthHeaders();

  return (
    <>
      <Header>new page</Header>
      <PageContainer>
        <StyledUploadFile headers={headers} />
        <MagazineTitleInput placeholder="Enter the main heading..." />
        <Divider />
        <MagazineDescriptionInput rows={4} placeholder="add a description..." />
        <Divider />
        <Popup show={true} />
      </PageContainer>
    </>
  );
};

export default PaperCreate;
