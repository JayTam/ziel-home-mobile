import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios, { AxiosError, CancelTokenSource } from "axios";
import UploadIcon from "../src/assets/icons/upload.svg";
import DeleteIcon from "../src/assets/icons/delete.svg";
import Button from "./Button";
import Progress from "./Progress";
import { calcMD5, composeAuthHeaders } from "../src/utils";

interface UploadFileProps {
  className?: string;
  name?: string;
  uploadName?: string;
  value?: string;
  type?: "image" | "video";
  headers?: Record<string, string>;
  action?: string;
  onChange?: (value: string) => void;
  onError?: (error: AxiosError) => void;
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

// 分片，每一片的大小为1M，单位是 bytes
const CHUNK_SIZE = 1000 * 1000;
// 最大限制 500Mb
// const MAX_SIZE = 1000 * 1000 * 500;
// 最大重传次数
const MAX_RETRY_TIMES = 3;
const BASE_URL = "https://passport-gw.zielhome.com";

const request = axios.create({
  baseURL: BASE_URL,
});

request.interceptors.request.use(
  async (config) => {
    // 这里只有客户端的cookie生效了，
    // 如果要获取服务端cookie的话，在getServerSideProps中获取request中的cookie，再手动设置到每个请求的请求头中
    const headers = composeAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

interface ChunkFormData {
  formData: FormData;
  index: number;
  fileName: string;
  isUpload: boolean;
  retryNum: number;
}

/**
 * 分片上传流程
 * 1. 初始化分片上传，如果文件的hash在后端已经缓存，直接返回下载地址跳过后续步骤
 * 2. 切片上传，将文件切片，一片一片并发上传，如果有错误，重新上传直到所有分片都上传为止
 * 3. 合并分片，调用后端合并切片接口，然后拿到下载地址
 */
const UploadFile = React.forwardRef<HTMLInputElement, UploadFileProps>((props, ref) => {
  const { className, name, type, uploadName, value, headers, onChange, onError } = props;
  const innerRef = useRef<HTMLInputElement>(null);
  const cancelTokenSource = useRef<CancelTokenSource>(axios.CancelToken.source());
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  // 分片上传upload id
  const uploadId = useRef<string | null>(null);

  /**
   * 初始化文件上传
   */
  const uploadInitial = async (file: File) => {
    const md5 = await calcMD5(file);
    const response = await request({
      method: "GET",
      url: "/a1/file/multipartupload/init",
      params: {
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        file_md5: md5,
        resource_type: "community",
      },
    });
    uploadId.current = response.data.upload_id;
    return response.data.download_path !== "";
  };

  /**
   * 切片上传
   * @param file
   */
  const uploadChunks = async (file: File) => {
    // const hash = await calcMD5(file);
    const chunkFormDataList = createFileChunk(file).map(({ file: chunk }, index) => {
      const formData = new FormData();
      if (uploadId.current) formData.append("upload_id", uploadId.current);
      formData.append("file", chunk);
      // 文件名使用切片的下标
      formData.append("chunk_num", index.toString());
      return { formData, index, fileName: file.name, isUpload: false, retryNum: 0 };
    });
    setLoading(true);
    await sendUploadRequest(chunkFormDataList);
    const videoUrl = await mergeRequest();
    setLoading(false);
    setPreview(videoUrl);
    props.onChange?.(videoUrl);
  };

  /**
   * 普通的文件上传
   * @param file
   */
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append(uploadName ?? "file", file);
    setLoading(true);
    cancelTokenSource.current = axios.CancelToken.source();
    request({
      method: "POST",
      url: "/a1/multiupload?type=community",
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
      .catch((error: AxiosError) => {
        if (axios.isCancel(error)) return;
        alert(`An error occurred while uploading the file, please retry!`);
        onError?.(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 并行发送请求
   * @param chunkFormDataList
   * @param threadNum
   */
  const sendUploadRequest = (chunkFormDataList: ChunkFormData[], threadNum = 10): Promise<void> => {
    let uploadChunks = 0;
    const totalChunks = chunkFormDataList.length;

    return new Promise((resolve, reject) => {
      const singleRequest = () => {
        const chunkFormData = chunkFormDataList.shift();
        if (!chunkFormData) return;
        request({
          method: "POST",
          url: "/a2/multipartupload",
          data: chunkFormData?.formData,
        })
          .then(() => {
            chunkFormData.isUpload = true;
            uploadChunks += 1;
            if (uploadChunks >= totalChunks) resolve();
            else singleRequest();
          })
          .catch((error) => {
            if (chunkFormData.retryNum < MAX_RETRY_TIMES) {
              chunkFormData.retryNum += 1;
              chunkFormData.isUpload = false;
              chunkFormDataList.push(chunkFormData);
              singleRequest();
            } else {
              reject(error);
            }
          });
      };
      while (threadNum--) singleRequest();
    });
  };

  /**
   * 通知服务端合并切片
   */
  const mergeRequest = (): Promise<string> => {
    return new Promise((resolve) => {
      const askCompleteTranscoding = (downloadPath: string) => {
        request({
          method: "GET",
          url: `/a1/file/metadata/?fd=${downloadPath}`,
        })
          .then(() => {
            resolve(downloadPath);
          })
          .catch(() => {
            setTimeout(() => {
              askCompleteTranscoding(downloadPath);
            }, 1000);
          });
      };

      request({
        method: "GET",
        url: "/a1/file/multipartupload/merge",
        params: {
          upload_id: uploadId.current,
        },
      }).then((response) => {
        if (response.data.download_path !== "") {
          askCompleteTranscoding(response.data.video.transcodes["mp4.h264.720p"].download_path);
        }
      });
    });
  };

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

  /**
   * 将要blob文件转换成base64格式
   * @param file
   */
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

  /**
   * 创建文件切片
   */
  const createFileChunk = (file: File, size = CHUNK_SIZE): { file: Blob }[] => {
    const fileChunkList = [];
    let count = 0;
    while (count < file.size) {
      fileChunkList.push({
        file: file.slice(count, count + size),
      });
      count += size;
    }
    return fileChunkList;
  };

  // 解决 input file 重复选取同一个文件，不触发onChange事件
  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.currentTarget.value = "";
  };

  /**
   * 视频上传用分片上传，图片上传使用普通上传
   * @param event
   */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (type === "image") {
      // 普通上传
      await uploadFile(file);
    } else {
      // 分片上传
      // 是否上传过
      const isUpload = await uploadInitial(file);
      if (isUpload) {
        setUploadingProgress(1);
        return;
      } else {
        await uploadChunks(file);
      }
    }
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
  type: "image",
  error: false,
  placeholder: "upload file",
};

export default UploadFile;
