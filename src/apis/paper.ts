import snsRequest from "./requests/snsRequest";
import { AxiosRequestConfig } from "axios";
import { MagazineType, mapMagazineItem } from "./magazine";

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
  //文章状态 0-草稿 1-待审核 2-已发布 3-审核未通过
  status: 0 | 1 | 2 | 3;
  magazine?: MagazineType;
};

export const mapPaperItem = (item: Record<string, any>) => {
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
    status: item.status ?? 0,
    magazine: item.magazine ? mapMagazineItem(item.magazine) : null,
  };
};

export type PaperParams = {
  paperId?: string;
  magazineId: string;
  page: number;
  limit?: number;
};
export type UserPaperParams = {
  userId: string;
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
      limit: 8,
      page: params.page,
      pages_id: params.paperId,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapPaperItem);
    return response;
  });
};

/**
 * 点赞内容
 * @param paperId
 * @param isLike
 */
export const likePaper = (paperId: string, isLike: boolean) => {
  return snsRequest({
    url: "/like/state",
    method: "POST",
    params: {
      article_id: paperId,
      is_state: isLike ? 1 : 0,
    },
  });
};

/**
 * 收藏内容
 * @param paperId
 * @param isStar
 */
export const starPaper = (paperId: string, isStar: boolean) => {
  return snsRequest({
    url: "/favorite/state",
    method: "POST",
    params: {
      article_id: paperId,
      is_state: isStar ? 1 : 0,
    },
  });
};

/**
 * 置顶内容
 * @param id 内容ID
 * @param magazineId 杂志ID
 * @param isTop
 */
export const topPaper = (id: string, magazineId: string, isTop: boolean) => {
  return snsRequest({
    url: "/article/top",
    method: "POST",
    params: {
      id,
      is_top: isTop ? 1 : 0,
      magazine_id: magazineId,
    },
  });
};

/**
 * 获取用户的文章列表
 * @param params
 * @param options
 */
export function getUserPapers(params: UserPaperParams, options?: AxiosRequestConfig) {
  return snsRequest({
    method: "GET",
    url: "/user/article",
    params: {
      limit: params.limit ?? 8,
      page: params.page,
      user_id: params.userId,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapPaperItem);
    return response;
  });
}
export interface CreatePaperParams {
  title: string;
  content: string;
  is_hot?: 1 | 0;
  is_top?: 1 | 0;
  img_url?: string[];
  img_url_cover?: string;
  video_url: string;
  magazine_id: string;
  status?: 1 | 0;
  spec:
    | {
        space: string;
        acreage: string;
        style: string;
      }
    | string;
}

/**
 * 创建内容
 * @param params
 */
export const createPaper = (params: CreatePaperParams) => {
  params.spec = JSON.stringify(params.spec);
  return snsRequest({
    url: "/article/add",
    method: "POST",
    data: {
      ...params,
      status: 1,
    },
  });
};

export interface UpdatePaperParams extends CreatePaperParams {
  id: string;
}
/**
 * 更新内容
 * @param params
 */
export const updatePaper = (params: UpdatePaperParams) => {
  params.spec = JSON.stringify(params.spec);
  return snsRequest({
    url: "/article/update",
    method: "POST",
    data: {
      ...params,
      status: 1,
    },
  });
};

/**
 * 获取用户收藏的文章列表
 * @param params
 * @param options
 * @returns
 */
export function getStarPapers(params: UserPaperParams, options?: AxiosRequestConfig) {
  return snsRequest({
    method: "GET",
    url: "/favorite/article",
    params: {
      user_id: params.userId,
      limit: params.limit ?? 8,
      page: params.page ?? 1,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapPaperItem);
    return response;
  });
}

interface UserSubscribePaperParams extends Omit<UserPaperParams, "userId"> {
  paperId: string;
}

/**
 * 获取用户的文章列表
 * @param params
 * @param options
 */
export function getUserSubscribePapers(
  params: UserSubscribePaperParams,
  options?: AxiosRequestConfig
) {
  return snsRequest({
    method: "GET",
    url: "/user/subscribe_article",
    params: {
      limit: params.limit ?? 8,
      page: params.page,
      article_id: params.paperId,
    },
    ...options,
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapPaperItem);
    return response;
  });
}

/**
 * 从杂志中删除某篇内容
 * @param magazineId 杂志ID
 * @param paperId 内容ID
 */
export const deletePaper = (magazineId: string, paperId: string) => {
  return snsRequest({
    url: "/article/del",
    method: "POST",
    params: {
      magazine_id: magazineId,
      id: paperId,
    },
  });
};
