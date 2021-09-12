import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { resizeImage } from "./oss";
import Loading from "../Loading";

interface Props {
  name?: string;
}

type NativeAttrs = Omit<React.ImgHTMLAttributes<any>, keyof Props>;

export type ImageProps = Props & NativeAttrs;

const Container = styled.div`
  position: relative;
`;

const StyledImage = styled.img``;

const StyledLoading = styled(Loading)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ImageComponent = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const [loading, setLoading] = useState(true);
  // 模糊的图片地址
  const blurImageSrc = useMemo(
    () =>
      resizeImage(props.src, {
        w: 5,
        h: 5,
      }),
    [props.src]
  );
  const [preview, setPreview] = useState<string>(blurImageSrc);
  // 压缩之后的图片地址
  const resizeImageSrc = useMemo(
    () =>
      resizeImage(props.src, {
        w: props.width,
        h: props.height,
      }),
    [props.height, props.src, props.width]
  );

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
  }, []);

  return (
    <Container>
      <StyledImage {...props} ref={ref} src={preview} />
      {loading ? <StyledLoading /> : null}
    </Container>
  );
});

ImageComponent.displayName = "Image";

export default ImageComponent;
