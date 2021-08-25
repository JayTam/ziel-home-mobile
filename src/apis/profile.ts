import snsRequest from "./requests/snsRequest";
import { AxiosRequestConfig } from "axios";

export type ProfileType = {
  id: string;
  avatar: string;
  nickname: string;
  signature: string;
  paperNum: number;
  followerNum: number;
  followingNum: number;
  isFollow: boolean;
};

const mapProfileItem = (item: Record<string, any>) => ({
  id: item.user_id ?? item.id ?? "",
  avatar: item.avatar ?? "",
  nickname: item.nickname ?? "",
  signature: item.signature ?? "",
  paperNum: item.article ?? 0,
  followerNum: item.follower ?? 0,
  followingNum: item.following ?? 0,
  isFollow: Boolean(item.is_follow),
});

/**
 * 关注用户
 * @param userId 用户ID
 * @param isFollow 是否关注
 */
export function followUser(userId: string, isFollow: boolean) {
  return snsRequest({
    method: "POST",
    url: "/follow/state",
    params: {
      user_id: userId,
      is_state: isFollow ? 1 : 0,
    },
  });
}

/**
 * 获取用户的主页信息(个人和他人)
 * @param userId 用户ID
 * @param options
 * @returns
 */
export function getProfileInfo(userId: string, options?: AxiosRequestConfig) {
  return snsRequest({
    method: "GET",
    url: "/userinfo",
    params: {
      user_id: userId,
    },
    ...options,
  }).then((response) => {
    response.data.result = mapProfileItem(response.data.result);
    return response;
  });
}

interface FollowersParams {
  userId: string;
  // followers-我的粉丝 following-我的关注
  type: "followers" | "following";
  page?: number;
  limit?: number;
}

/**
 * 获取 关注我的用户列表 或者 我关注的用户列表
 * @param params
 * @param options
 */
export function getFollowers(params: FollowersParams, options?: AxiosRequestConfig) {
  return snsRequest({
    method: "GET",
    url: "/user/followers",
    params: {
      user_id: params.userId,
      follow_type: params.type,
      limit: 20,
      ...params,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapProfileItem);
    return response;
  });
}
