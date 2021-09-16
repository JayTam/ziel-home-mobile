import { isDef } from "@/utils/base";

export const addPercentUnit = (val?: string | number) => {
  if (!isDef(val)) return undefined;
  if (typeof val === "string") {
    if (val.endsWith("%")) return val;
  } else {
    return val + "%";
  }
};
