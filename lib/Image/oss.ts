type TResizeOptions = {
  [key: string]: unknown;
  m?: "lfit" | "mfit" | "fill" | "pad" | "fixed";
  w?: number | string;
  h?: number | string;
};

type TBlurOptions = {
  [key: string]: unknown;
  r?: number | string;
  s?: number | string;
};

export const resizeImage = (originImage?: string, options?: TResizeOptions) => {
  if (!originImage) return "";
  let query = `x-oss-process=image/resize`;
  for (const key in options) {
    if (options[key]) {
      query += `,${key}_${options[key]}`;
    }
  }
  const hasFirstQuery = originImage.indexOf("?") > -1;
  return originImage + (hasFirstQuery ? "&" : "?") + query;
};

export const blurImage = (originImage?: string, options: TBlurOptions = { r: 50, s: 50 }) => {
  if (!originImage) return "";
  let query = `x-oss-process=image/blur`;
  for (const key in options) {
    if (options[key]) {
      query += `,${key}_${options[key]}`;
    }
  }
  const hasFirstQuery = originImage.indexOf("?") > -1;
  return originImage + (hasFirstQuery ? "&" : "?") + query;
};
