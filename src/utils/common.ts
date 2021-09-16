const fixedFloat = (num: string, type?: string) => {
  const numArr = parseFloat(num).toString().split(".");
  const numInt = numArr[0];
  const numDec = numArr[1];
  let result = "";
  if (type === "Int") {
    result = numInt;
  } else {
    result = `${numInt}.${numDec ? numDec.substr(0, 1) : "0"}`;
  }
  return result;
};
/**
 * 数字换算
 */
export const digitalScale = (num?: number | string, type?: string) => {
  if (!num) return 0;
  let newNum: number | string;
  if (num > 1e3 && num < 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e3).toString(), type)}K`;
  } else if (num >= 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e6).toString(), type)}M`;
  } else {
    newNum = num;
  }
  return newNum;
};
/**
 * 时间换算
 */
export const getCreateTime = (time: string) => {
  const newTime = new Date().valueOf() - new Date(time).valueOf();
  const hours = newTime / 1000 / 60 / 60;
  if (hours < 1) {
    return "Just commented";
  } else if (hours > 1 && hours < 24) {
    return `${hours.toFixed(0)} hours ago`;
  } else if (hours >= 24 && hours < 720) {
    return `${(hours / 24).toFixed(0)} days ago`;
  } else if (hours >= 720 && hours < 8640) {
    return `${(hours / 720).toFixed(0)} month ago`;
  } else if (hours >= 8640) {
    return `${(hours / 8640).toFixed(0)} years ago`;
  }
};

/**
 * 替换成存放图片的原地址（分享时方便第三方抓取）
 */
export const replaceToImgBaseUrl = (cdnUrl?: string) => {
  return cdnUrl?.replace(
    "https://s1.zielhome.com",
    "https://ziel-pp-public.oss-cn-hongkong.aliyuncs.com"
  );
};
