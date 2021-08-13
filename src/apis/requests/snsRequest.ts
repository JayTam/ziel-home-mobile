import axios from "axios";
import JSONBigint from "json-bigint";
import { composeAuthHeaders } from "../../utils";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SNS_BASE_URL,
  transformResponse: [
    // 因为id是一个bigint，JSON.parse解析会发生精度丢失问题，所以使用JSONBigint解析，将超过精度的Number类型转换成String类型
    (responseString) => {
      try {
        return JSONBigint.parse(responseString, (key, value) =>
          value?._isBigNumber ? value.toString() : value
        );
      } catch (e) {
        throw new Error(`[Axios Error]: axios transformResponse error. ${JSON.stringify(e)}`);
      }
    },
  ],
});

request.interceptors.request.use(async (config) => {
  // 这里只有客户端的cookie生效了，
  // 如果要获取服务端cookie的话，在getServerSideProps中获取request中的cookie，再手动设置到每个请求的请求头中
  const headers = composeAuthHeaders();
  config.headers = { ...config.headers, ...headers };
  return config;
});

request.interceptors.response.use(async (response) => {
  switch (response.data.status) {
    case 0:
      return response;
    default:
      return Promise.reject(new Error(`Unknown error: ${JSON.stringify(response.data)}`));
  }
});

export default request;
