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

/**
 * 是否是百分比
 * @param value
 */
const isPercentNum = (value?: string | number) => {
  if (typeof value !== "string") return false;
  return value.endsWith("%");
};

export const resizeImage = (originImage?: string, options?: TResizeOptions) => {
  if (!originImage) return "";
  let query = `x-oss-process=image/resize`;
  for (const key in options) {
    const value = (options[key] as string).toString();
    if (value) {
      if (key === "w" || key === "h") {
        if (!isPercentNum(value)) {
          query += `,${key}_${parseInt(value) * 2}`;
        }
      } else {
        query += `,${key}_${value}`;
      }
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
