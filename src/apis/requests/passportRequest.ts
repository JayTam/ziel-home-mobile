import axios from "axios";
import JSONBigint from "json-bigint";
import { composeAuthHeaders } from "../../utils";
import { isServer } from "../../utils";
import { store } from "../../app/store";
import { logoutAsync } from "../../app/features/user/userSlice";

const request = axios.create({
  baseURL: isServer() ? process.env.PAASPORT_BASE_URL : process.env.NEXT_PUBLIC_PAASPORT_BASE_URL,
  transformResponse: [
    // 因为id是一个bigint，JSON.parse解析会发生精度丢失问题，所以使用JSONBigint解析，将超过精度的Number类型转换成String类型
    (responseString) =>
      JSONBigint.parse(responseString, (key, value) => {
        return value?._isBigNumber ? value.toString() : value;
      }),
  ],
});

request.interceptors.request.use(
  async (config) => {
    // 这里只有客户端的cookie生效了，
    // 如果要获取服务端cookie的话，在getServerSideProps中获取request中的cookie，再手动设置到每个请求的请求头中
    const headers = composeAuthHeaders();
    config.headers = { ...config.headers, ...headers };
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      // 跳过注销时异常, status = 401
      if (error.response.config.url === "/logout") return;
      await store?.dispatch(logoutAsync(true));
    }
    return error;
  }
);

export default request;
