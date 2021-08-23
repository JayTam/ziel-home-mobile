import snsRequest from "./requests/snsRequest";
import { AxiosRequestConfig } from "axios";

export type MagazineType = {
  id: string;
  // 杂志标题
  title: string;
  // 杂志描述
  description: string;
  // 杂志作者ID
  authorId: string;
  // 杂志作者
  author: string;
  // 杂志作者头像
  avatar: string;
  // 浏览量
  viewNum: number;
  // 曝光量
  showNum: number;
  // 订阅量
  subscribeNum: number;
  // 参与编辑人数
  editorNum: number;
  // 封面图
  cover: string;
  // 是否订阅
  isSubscribe: boolean;
  // 是否公开
  isPublic: boolean;
  // 是否推荐
  isRecommend: boolean;
  // 是否选中
  isActive: boolean;
};

const mapMagazineItem = (item: Record<string, any>) => ({
  id: item.id ?? item.magazine_id ?? "",
  title: item.title ?? "",
  description: item.desc ?? "",
  author: item.userinfo?.nickname ?? "",
  authorId: item.user_id ?? "",
  avatar: item.userinfo?.avatar ?? "",
  viewNum: item.view_num ?? 0,
  showNum: item.show_num ?? 0,
  editorNum: item.editor_num ?? 0,
  subscribeNum: item.subscriber ?? 0,
  cover: item.img_url ?? "",
  isSubscribe: item.is_subscribe ?? false,
  isPublic: item.is_pub ?? false,
  isRecommend: item.is_recommend ?? false,
  isActive: false,
});

export type MagazineParams = {
  page: number;
  limit?: number;
  title?: string;
};

/**
 * 获取下一条杂志详情
 * @param magazineId 杂志ID，如果不传，获取第一条杂志
 * @param options
 */
export const getNextMagazine = (magazineId?: string, options?: AxiosRequestConfig) => {
  return snsRequest({
    url: "/magazine/last",
    method: "GET",
    params: {
      magazine_id: magazineId,
    },
    ...options,
  }).then((response) => {
    response.data.result = mapMagazineItem(response.data.result);
    return response;
  });
};

/**
 * 订阅杂志
 * @param magazineId 杂志ID
 * @param isSubscribe 是否订阅
 */
export const subscribeMagazine = (magazineId: string, isSubscribe: boolean) => {
  return snsRequest({
    url: "/subscribe/state",
    method: "POST",
    params: {
      magazine_id: magazineId,
      is_state: isSubscribe ? 1 : 0,
    },
  });
};

export interface MagazinesForChooseParams extends MagazineParams {
  // 1- published（我的杂志） 2- join (参与的) 3-discover（推荐投稿） 默认1
  type: "1" | "2" | "3";
}

/**
 * 选择杂志时，获取杂志列表
 * @param params
 */
export const getMagazinesForChoose = (params: MagazinesForChooseParams) => {
  return snsRequest({
    url: "/user/publish_magazine",
    method: "GET",
    params,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapMagazineItem);
    return response;
  });
};
