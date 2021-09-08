import snsRequest from "./requests/snsRequest";
export type CommentType = {
  id: string;
  userId: string;
  // 评论者名字
  author: string;
  // 评论者头像
  avatar: string;
  // 评论内容
  content: string;
  // 评论时间
  createTime: string;
  // 喜欢数量
  likeNum: number;
  // 这个评论被评论的数量
  commentNum: number;
  // 对于当前用户是否喜欢
  isLike: boolean;
  // 回复数量
  replyNum: number;
  // 回复的评论发起者名字
  parentUser: string;
  // 回复的评论发起Id
  parentUserId: string;
};

const mapCommentItem = (item: Record<string, any>) => {
  return {
    id: item.id ?? "",
    userId: item.user_id ?? "",
    author: item.user_info?.nickname ?? "",
    avatar: item.user_info?.avatar ?? "",
    content: item.contents ?? "",
    likeNum: item.like_num ?? 0,
    commentNum: item.comment_num ?? 0,
    isLike: Boolean(item.is_like),
    createTime: item.created_at ?? "",
    replyNum: item.reply_num ?? 0,
    parentUser: item.parent_user ?? "",
    parentUserId: item.parent_user_id ?? "",
  };
};

export type CommentParams = {
  page: number;
  limit?: number;
};
// 获取评论列表
export const getCommentList = (paperId: string, params?: CommentParams) => {
  return snsRequest({
    url: "/comments",
    method: "GET",
    params: {
      article_id: paperId,
      limit: 8,
      ...params,
    },
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapCommentItem);
    return response;
  });
};

//获取回复列表
type ReplyParams = CommentParams;

export const getReplyList = (commentId: string, params?: ReplyParams) => {
  return snsRequest({
    url: "/comment/reply",
    method: "GET",
    params: {
      reply_id: commentId,
      limit: 6,
      ...params,
    },
  }).then((response) => {
    response.data.result.data = response.data.result.data.map(mapCommentItem);
    return response;
  });
};

/**
 *  发表评论
 */
export const replyPaper = (paperId: string, contents: string) => {
  return snsRequest({
    url: "/comment/add",
    method: "POST",
    data: {
      article_id: paperId,
      contents,
    },
  });
};

/**
 *  回复评论
 */
export const replyComment = (
  paperId: string,
  contents: string,
  commentId: string,
  targetUserId: string,
  targetNickName: string
) => {
  return snsRequest({
    url: "/comment/add",
    method: "POST",
    data: {
      article_id: paperId,
      contents,
      comment_id: commentId,
      user_id: targetUserId,
      nickname: targetNickName,
    },
  });
};

/**
 * 点赞评论/评论的回复，都使用这个接口
 * @param id 评论/回复的id
 * @param isLike 点赞/取消点赞
 */
export const likeComment = (id: string, isLike: boolean) => {
  return snsRequest({
    url: isLike ? "/comment_like" : "comment_unlike",
    method: "POST",
    data: {
      comment_id: id,
    },
  });
};
