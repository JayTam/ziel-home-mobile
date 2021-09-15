export function isIOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export function isDef<T>(val: T) {
  return val !== undefined && val !== null;
}

export function isClient() {
  return typeof window !== "undefined";
}

export function isServer() {
  return typeof window === "undefined";
}

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function isIPV4(checkValue?: string) {
  if (checkValue) {
    return /\d{1,4}\.\d{1,4}\.\d{1,4}\.\d{1,4}/.test(checkValue);
  }
  return false;
}
