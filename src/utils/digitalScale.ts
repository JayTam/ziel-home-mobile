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
export const digitalScale = (num: number | string, type?: string) => {
  let newNum: number | string = "" || 0;
  if (num > 1e3 && num < 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e3).toString(), type)}K`;
  } else if (num >= 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e6).toString(), type)}M`;
  } else {
    newNum = num;
  }
  return newNum;
};
