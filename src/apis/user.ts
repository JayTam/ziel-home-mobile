import passportRequest from "./requests/passportRequest";
import { AxiosRequestConfig } from "axios";

// 根据token获取账户信息(返回所有用户信息)
export function fetchUserInfo(options?: AxiosRequestConfig) {
  return passportRequest({
    method: "GET",
    url: "/account",
    ...options,
  });
}

/**
 * 更新账户资料
 * @param params
 * @param options
 * @returns
 */
export type accountUpdateParams = {
  //国家码
  country?: string;
  // 省份
  province?: string;
  // 城市
  city?: string;
  // 地区
  area?: string;
  // 街道
  street?: string;
  // 自定义地址
  custom_address?: string;
  // 出生日期 yyyy-mm-dd
  birthday?: string;
  // 性别
  gender?: number;
  // 昵称
  name?: string;
  // 签名
  signature?: string;
  // 用户名
  username?: string;
};

export function accountUpdate(
  uid: string,
  params: accountUpdateParams,
  options?: AxiosRequestConfig
) {
  return passportRequest({
    method: "PUT",
    url: `/account/${uid}/update`,
    data: {
      ...params,
    },
    ...options,
  });
}

// 登出
export function fetchLogout() {
  return passportRequest({
    url: "/logout",
    method: "DELETE",
  });
}

/**
 * 上传头像
 * @param file 头像文件
 */
export function uploadUserAvatar(file: any) {
  return passportRequest({
    method: "POST",
    url: `multiupload?type=AVATAR`,
    data: file,
  });
}

/**
 * 更新头像
 * @param uid
 * @param user 用户信息
 */
export function updateUserAvatar(uid: string, user: any) {
  return passportRequest({
    method: "PUT",
    url: `/account/${uid}/avatar`,
    data: {
      ...user,
    },
  });
}
