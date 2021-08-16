import snsRequest from "./requests/snsRequest";
import { AxiosRequestConfig } from "axios";

export type PaperType = {
  // 内容ID
  id: string;
  // 是否正在拖动中
  touching: boolean;
  // 杂志ID
  magazineId: string;
  // 作者的用户ID
  authorId: string;
  // 创建时间
  createTime: string;
  // 作者名
  author: string;
  // 作者头像
  avatar: string;
  // 标题
  title: string;
  // 描述信息
  description: string;
  // 视频封面
  poster: string;
  // 视频
  video: string;
  // 喜欢数量
  likeNum: number;
  // 评论数量
  commentNum: number;
  // 分享数量
  shareNum: number;
  // 收藏数量
  starNum: number;
  // 播放数量
  playNum: number;
  // 是否关注
  isFollow: boolean;
  // 是否喜欢
  isLike: boolean;
  // 是否置顶
  isTop: boolean;
  // 是否收藏
  isStar: boolean;
  // 是否正在播放中
  isPlay: boolean;
  // 当前播放时间
  currentTime?: number;
  // 规格
  space: string;
  size: string;
  style: string;
};

const mapPaperItem = (item: Record<string, any>) => {
  const spec = JSON.parse(item.spec || "{}");
  return {
    id: item.id ?? "",
    authorId: item.userinfo?.id ?? "",
    author: item.userinfo?.nickname ?? "",
    avatar: item.userinfo?.avatar ?? "",
    title: item.title ?? "",
    description: item.content ?? "",
    poster: item.img_url_cover ?? "",
    video: item.video_url ?? "",
    likeNum: item.like_num ?? 0,
    shareNum: item.share_num ?? 0,
    starNum: item.favorite_num ?? 0,
    commentNum: item.comment_num ?? 0,
    playNum: item.play_num ?? 0,
    isLike: Boolean(item.is_like),
    isFollow: Boolean(item.is_follow),
    isStar: Boolean(item.is_favorite),
    isTop: Boolean(item.is_top),
    isPlay: false,
    touching: false,
    currentTime: 0,
    createTime: item.created_at ?? "",
    magazineId: item.magazine_id ?? "",
    space: spec?.space ?? "",
    style: spec?.style ?? "",
    size: spec?.acreage ?? "",
  };
};

export type PaperParams = {
  magazineId: string;
  page: number;
  limit?: number;
};

/**
 * 获取内容列表
 * @param params
 * @param options
 */
export const getPaperList = (params: PaperParams, options?: AxiosRequestConfig) => {
  return snsRequest({
    url: "/articles",
    method: "GET",
    params: {
      magazine_id: params.magazineId,
      limit: 2,
      page: params.page,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapPaperItem);
    return response;
  });
};