import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLogout } from "../../../apis";
import { AppThunk } from "../../store";
import { parsePassportRedirectURL, removeAuth } from "../../../utils";
import Router from "next/router";

// http://passport-doc.zieldev.com/api/%E8%B4%A6%E6%88%B7%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3/#%E6%A0%B9%E6%8D%AEtoken%E8%8E%B7%E5%8F%96%E8%B4%A6%E6%88%B7%E4%BF%A1%E6%81%AFgetaccountinfo
export interface UserState {
  uid: string;
  // 地址
  country: string;
  province: string;
  city: string;
  area: string;
  street: string;
  // 自定义地址
  customer_id: string;
  custom_address: string;
  // 用户信息
  name: string;
  username: string;
  avatar: string;
  birthday: string;
  gender: number;
  protocols: string | null;
  signature: string;
  created_at: string;
  vip_info: {
    account_vip: string;
    type: 0 | 1;
    created_at: string;
    updated_at: string;
  };
  // 手机号码
  phone: {
    phone: string;
    security_phone: string;
    phone_country_code: string;
    phone_num: string;
    security_phone_country_code: string;
    security_phone_num: string;
  };
  // 邮箱
  email: {
    email: string;
  };
  // 第三方登陆
  thirds: [] | null;
  third_info: string;
}

const initialState: UserState = {
  uid: "",
  // 地址
  country: "",
  province: "",
  city: "",
  area: "",
  street: "",
  // 自定义地址
  customer_id: "",
  custom_address: "",
  // 用户信息
  name: "",
  username: "",
  avatar: "",
  birthday: "",
  gender: 0,
  protocols: "",
  signature: "",
  created_at: "",
  vip_info: {
    account_vip: "",
    type: 0,
    created_at: "",
    updated_at: "",
  },
  // 手机号码
  phone: {
    phone: "",
    security_phone: "",
    phone_country_code: "",
    phone_num: "",
    security_phone_country_code: "",
    security_phone_num: "",
  },
  // 邮箱
  email: {
    email: "",
  },
  // 第三方登陆
  thirds: [],
  third_info: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    cleanUser() {
      return initialState;
    },
  },
});

export const { setUserInfo, cleanUser } = userSlice.actions;

/**
 * 注销登陆
 * 该方法会在client调用，server端用户认证异常处理在 _app.tsx 获取用户信息的时候处理
 * @param isRedirectPassport 是否重定向到passport
 */
export const logoutAsync =
  (isRedirectPassport = false): AppThunk =>
  async (dispatch) => {
    try {
      await fetchLogout();
    } catch (error) {
      console.error("[logout error]:", error);
    } finally {
      removeAuth();
      if (isRedirectPassport) {
        await Router.push(parsePassportRedirectURL());
      } else {
        await Router.push("/");
      }
      dispatch(cleanUser());
    }
  };

export default userSlice.reducer;
