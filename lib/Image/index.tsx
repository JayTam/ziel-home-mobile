import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { resizeImage, TResizeOptions } from "./oss";
import Loading from "../Loading";
import _ from "lodash-es";
import { Property } from "csstype";
import { addPercentUnit } from "@/utils";

interface Props {
  blur?: boolean;
  loading?: boolean;
  fit?: Property.ObjectFit;
  // 等比缩放比例
  zoomOptions?: {
    w: string | number;
    h: string | number;
  };
  // oss图片剪切大小
  resizeOptions?: TResizeOptions;
}

type NativeAttrs = Omit<React.ImgHTMLAttributes<any>, keyof Props>;

export type ImageProps = Props & NativeAttrs;

const Container = styled.div<Pick<Props, "zoomOptions">>`
  position: relative;
  width: ${(props) => addPercentUnit(props.zoomOptions?.w)};
  padding-top: ${(props) => addPercentUnit(props.zoomOptions?.h)};
  font-size: 0;
  overflow: hidden;
`;

const StyledImage = styled.img<NativeAttrs & Pick<Props, "fit" | "zoomOptions">>`
  ${(props) =>
    props.zoomOptions
      ? `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    `
      : null}
  object-fit: ${(props) => props.fit};
`;

const StyledLoading = styled(Loading)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const PlaceholderImage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
`;

const ImageComponent = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const [loading, setLoading] = useState(true);
  const nativeProps = _.omit(props, "blur", "loading", "className");
  // 模糊的图片地址
  const blurImageSrc = useMemo(
    () =>
      resizeImage(props.src, {
        w: 5,
        h: 5,
      }),
    [props.src]
  );
  // 压缩之后的图片地址
  const resizeImageSrc = useMemo(
    () =>
      resizeImage(
        props.src,
        props.resizeOptions ?? {
          w: props.width,
          h: props.height,
        }
      ),
    [props.height, props.resizeOptions, props.src, props.width]
  );
  // 显示到界面的图片
  const [preview, setPreview] = useState<string>(props.blur ? blurImageSrc : resizeImageSrc);

  useEffect(() => {
    const img = new Image();
    setLoading(true);
    img.onload = () => {
      setPreview(resizeImageSrc);
      setLoading(false);
    };

    img.src = resizeImageSrc;

    return () => {
      img.onload = null;
    };
  }, [resizeImageSrc]);

  return (
    <Container className={props.className} zoomOptions={props.zoomOptions}>
      <StyledImage {...nativeProps} ref={ref} src={preview} />
      {!props.blur && props.loading && loading ? (
        <PlaceholderImage>
          <StyledLoading />
        </PlaceholderImage>
      ) : null}
      {props.children}
    </Container>
  );
});

ImageComponent.displayName = "Image";

export default ImageComponent;
