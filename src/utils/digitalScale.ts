const fixedFloat = (num: string) => {
  const numArr = parseFloat(num).toString().split(".");
  const numInt = numArr[0];
  const numDec = numArr[1];

  return `${numInt}.${numDec ? numDec.substr(0, 1) : "0"}`;
};
export const digitalScale = (num: number | string) => {
  let newNum = "";
  if (num > 1e3 && num < 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e3).toString())}K`;
  } else if (num >= 1e6) {
    newNum = `${fixedFloat((Number(num) / 1e6).toString())}M`;
  } else {
    newNum = num.toString();
  }
  return newNum;
};
