type TResizeOptions = {
  [key: string]: unknown;
  m?: "lfit" | "mfit" | "fill" | "pad" | "fixed";
  w?: number | string;
  h?: number | string;
};

export const resizeImage = (originImage: string, options: TResizeOptions) => {
  let query = `x-oss-process=image/resize`;
  for (const key in options) {
    if (options[key]) {
      query += `,${key}_${options[key]}`;
    }
  }
  const hasFirstQuery = originImage.indexOf("?") > -1;
  return originImage + (hasFirstQuery ? "&" : "?") + query;
};
