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
 * 杂志列表
 * @param params
 * @param options
 */
export const getMagazineList = (params: MagazineParams, options?: AxiosRequestConfig) => {
  return snsRequest({
    url: "/magazines",
    method: "GET",
    params: {
      limit: 8,
      ...params,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapMagazineItem);
    return response;
  });
};
