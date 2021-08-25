import { createContext, useContext } from "react";
import { isServer } from "./base";
import { PASSPORT_SUB_APP_ID_KEY } from "../constants";
import { AppContext } from "next/app";

export interface LoginContextState {
  isLogin?: boolean;
  openLogin: () => void;
  withLogin: <P1, P2 = unknown, P3 = unknown>(
    callback: (arg1?: P1, arg2?: P2, arg3?: P3) => void
  ) => (arg1?: P1, arg2?: P2, arg3?: P3) => void;
}

export const LoginContext = createContext<LoginContextState>({
  isLogin: false,
  openLogin: function () {
    console.log("打开登陆狂");
  },
  withLogin() {
    return () => {
      console.log("登陆之后才能进入的逻辑");
    };
  },
});

export const useLogin = () => {
  return useContext(LoginContext);
};

/**
 * 解析passport重定向地址
 */
export const parsePassportRedirectURL = (appContext?: AppContext) => {
  let redirectURI = "";
  if (appContext) {
    const { req, asPath } = appContext.ctx;
    if (isServer()) {
      const chunks = req?.headers.host?.split(":");
      let host = chunks?.[0];
      const port = chunks?.[1];
      if (host) {
        // localhost 开发环境下，加上端口，比如 localhost:3000
        host = host + (host === "localhost" ? ":" + port : "");
      }
      const protocol = port === "443" ? "https" : "http";
      redirectURI = `${protocol}://${host}${asPath}`;
    } else {
      redirectURI = window.location.href;
    }
  } else {
    redirectURI = window.location.href;
  }
  return `${process.env.NEXT_PUBLIC_PAASPORT_URL}?${PASSPORT_SUB_APP_ID_KEY}=${
    process.env.NEXT_PUBLIC_PAASPORT_APP_ID
  }&redirect_uri=${encodeURIComponent(redirectURI)}`;
};
