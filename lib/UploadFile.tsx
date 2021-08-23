import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios, { CancelTokenSource } from "axios";
import UploadIcon from "../src/assets/icons/upload.svg";
import DeleteIcon from "../src/assets/icons/delete.svg";
import Button from "./Button";
import Progress from "./Progress";

interface UploadFileProps {
  className?: string;
  name?: string;
  uploadName?: string;
  value?: string;
  type?: "image" | "video";
  headers?: Record<string, string>;
  action?: string;
  onChange?: (value: string) => void;
  onError?: () => void;
  error?: boolean;
  placeholder?: string;
  placeholderList?: string[];
  children?: React.ReactNode;
}

const Container = styled.div`
  position: relative;
  width: 120px;
  height: 160px;
`;

const UploadPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid #f5f5f5;
  border-radius: 14px;
  align-items: center;
`;

const ImagePreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadDeleteIcon = styled(DeleteIcon)`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 10;
`;

const LoadingMask = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingContainer = styled.div`
  width: 90%;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingTitle = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
`;

const LoadingProgress = styled(Progress)`
  margin: 14px 0;
`;

const UploadFile = React.forwardRef<HTMLInputElement, UploadFileProps>((props, ref) => {
  const { className, name, type, uploadName, value, action, headers, onChange, onError } = props;
  const innerRef = useRef<HTMLInputElement>(null);
  const cancelTokenSource = useRef<CancelTokenSource>(axios.CancelToken.source());
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);

  /**
   * 打开文件选择
   */
  const handleOpen = () => {
    innerRef.current?.click();
  };

  /**
   * 关闭文件选择
   */
  const handleClose = () => {
    setPreview("");
    onChange?.("");
  };

  const convertToBase64Async = (file: File) => {
    return new Promise<string>((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        const base64Image = e.target?.result;
        if (base64Image) {
          resolve(base64Image as string);
        }
      };
    });
  };

  // 解决 input file 重复选取同一个文件，不触发onChange事件
  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.value = "";
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append(uploadName ?? "file", file);

    setLoading(true);
    cancelTokenSource.current = axios.CancelToken.source();
    axios
      .request({
        method: "POST",
        url: action ?? "",
        data: formData,
        headers,
        cancelToken: cancelTokenSource.current.token,
        onUploadProgress: (event) => {
          setUploadingProgress((event.loaded / event.total) | 0);
        },
      })
      .then(async (response) => {
        const uploadedURL: string = response.data.data[0];
        if (type === "image") {
          const base64Image = await convertToBase64Async(file);
          setPreview(base64Image);
        } else {
          setPreview(uploadedURL);
        }
        onChange?.(uploadedURL);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        alert(`An error occurred while uploading the file, please retry!`);
        onError?.();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className={className} ref={ref}>
      {loading ? (
        <LoadingMask>
          <LoadingContainer>
            <LoadingTitle>Upload the original file</LoadingTitle>
            <LoadingProgress percentage={uploadingProgress} />
            <Button>cancel</Button>
          </LoadingContainer>
        </LoadingMask>
      ) : null}
      {!preview ? (
        <UploadPlaceholder onClick={handleOpen}>
          <UploadIcon />
        </UploadPlaceholder>
      ) : null}
      {preview ? (
        <ImagePreviewWrapper>
          {type === "image" ? (
            <ImagePreview src={preview} />
          ) : (
            <VideoPreview src={preview} controls={false} autoPlay muted loop />
          )}
        </ImagePreviewWrapper>
      ) : null}
      {preview ? <UploadDeleteIcon onClick={handleClose} /> : null}
      <input
        name={name}
        accept={`${type}/*`}
        ref={innerRef}
        type="file"
        style={{ display: "none" }}
        value={value}
        onChange={handleChange}
        onClick={handleInputClick}
      />
    </Container>
  );
});

UploadFile.displayName = "UploadFile";

UploadFile.defaultProps = {
  action: `${process.env.NEXT_PUBLIC_PAASPORT_BASE_URL}/multiupload?type=community`,
  type: "image",
  error: false,
  placeholder: "upload file",
};

export default UploadFile;
