import { isDef, randomInt } from "@/utils/base";
import { MAGAZINE_CARD_COLOR_LIST } from "@/constants";

/**
 * 添加百分比单位
 * @param val
 */
export const addPercentUnit = (val?: string | number) => {
  if (!isDef(val)) return undefined;
  if (typeof val === "string") {
    if (val.endsWith("%")) return val;
  } else {
    return val + "%";
  }
};

/**
 * 生成随机颜色
 */
export const randomColor = () => {
  const len = MAGAZINE_CARD_COLOR_LIST.length;
  const index = randomInt(0, len - 1);
  return MAGAZINE_CARD_COLOR_LIST[index];
};

/**
 * 规范化16进制颜色
 */
export const normalizeHexColor = (hexColor?: string) => {
  if (!hexColor) return;
  return hexColor.replace(/0X/i, "#");
};
