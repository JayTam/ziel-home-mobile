import { NextPage } from "next";
import { composeAuthHeaders } from "../../utils";
import { useForm } from "react-hook-form";
import { createPaper, CreatePaperParams, updatePaper, UpdatePaperParams } from "../../apis/paper";
import Header from "../../components/Header";
import MagazineSelector from "../../components/MagazineSelector/MagazineSelector";
import React from "react";
import styled from "styled-components";
import UploadFile from "../../../lib/UploadFile";
import Button from "../../../lib/Button";
import { useRouter } from "next/router";
import { useAppSelector } from "../../app/hook";
import { AxiosError } from "axios";
import { store } from "../../app/store";
import { logoutAsync } from "../../app/features/user/userSlice";

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

const SubmitButton = styled(Button)`
  margin-top: 100px;
`;

export type Options = {
  key: string;
  value: string;
}[];

type PaperForm = {
  id: string;
  // 标题
  title: string;
  // 描述
  description: string;
  // 视频地址
  video: string;
  // 封面地址
  poster: string;
  // 空间
  space: string;
  // 样式
  style: string;
  // 大小
  size: string;
  // 杂志ID
  magazineId: string;
};

export type EditPaperProps = {
  styleOptions: Options;
  spaceOptions: Options;
  sizeOptions: Options;
  form?: PaperForm;
  // 是创建还是编辑
  type?: "edit" | "create";
};

type Inputs = {
  id: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  space: string;
  style: string;
  size: string;
  magazineId: string;
};

const EditPaper: NextPage<EditPaperProps> = (props) => {
  const isEdit = (props.type ?? "edit") === "edit";
  const user = useAppSelector((state) => state.user);
  const headers = composeAuthHeaders();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({
    mode: "onChange",
  });

  const onSubmit = handleSubmit<PaperForm>(async (data) => {
    const createParams: CreatePaperParams = {
      title: data.title,
      content: data.description,
      video_url: data.video,
      magazine_id: data.magazineId,
      spec: {
        space: data.space,
        acreage: data.size,
        style: data.style,
      },
    };
    const updateParams: UpdatePaperParams = { ...createParams, id: props.form?.id ?? "" };
    if (isEdit) {
      await updatePaper(updateParams);
    } else {
      await createPaper(createParams);
    }
    // from 参数是用于 /profile 页面区分返回逻辑
    await router.push(`/profile/${user.uid}?from=/paper/create`);
  });

  /**
   * 账号问题，跳转到passport重新登陆
   * @param error
   */
  const handleUploadError = async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await store?.dispatch(logoutAsync(true));
    }
  };

  return (
    <>
      <Header>{isEdit ? "update" : "new"} paper</Header>
      <PageContainer>
        <form onSubmit={onSubmit}>
          <StyledUploadFile
            type="video"
            headers={headers}
            {...register("video", { required: true })}
            onChange={(value) =>
              setValue("video", value, { shouldValidate: true, shouldDirty: true })
            }
            onError={handleUploadError}
          />
          <MagazineTitleInput
            placeholder="Enter the main heading..."
            maxLength={30}
            {...register("title", { required: true })}
          />
          <Divider />
          <MagazineDescriptionInput
            rows={4}
            placeholder="add a description..."
            maxLength={500}
            {...register("description")}
          />
          <Divider />
          <MagazineSelector
            {...register("magazineId", { required: true })}
            onChange={(value) =>
              setValue("magazineId", value, { shouldValidate: true, shouldDirty: true })
            }
          />
          <Divider />
          <SubmitButton
            color="primary"
            size="medium"
            type="submit"
            block
            disabled={!isDirty || !isValid || isSubmitting}
          >
            submit
          </SubmitButton>
        </form>
      </PageContainer>
    </>
  );
};

export default EditPaper;
