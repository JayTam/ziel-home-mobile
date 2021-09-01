import type { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { theme } from "../../lib";
import "normalize.css";
import "swiper/swiper.min.css";
import "swiper/components/effect-cube/effect-cube.min.css";
import "swiper/components/pagination/pagination.min.css";
import React from "react";
import {
  composeAuthHeaders,
  getAuth,
  getAuthByRoute,
  isServer,
  LoginContext,
  LoginContextState,
  parsePassportRedirectURL,
} from "../utils";
import { initialiseStore, useStore } from "../app/store";
import QueryString from "querystring";
import { fetchUserInfo } from "../apis";
import { setUserInfo } from "../app/features/user/userSlice";
import App from "next/app";
import { PASSPORT_DEVICE_ID_KEY, PASSPORT_TENANT_NAME_KEY, PASSPORT_TOKEN_KEY } from "../constants";
import { Provider } from "react-redux";
import Router from "next/router";
import "../styles/globals.css";

// 需要登陆的路由，未登陆态访问这些路由，重定向到首页
const needLoginRoutes = [
  "/paper/create",
  "/paper/edit/[paper_id]",
  "/magazine/create",
  "/setting/user",
  "/personal",
];

function MyApp(app: AppProps) {
  const { Component, pageProps } = app;

  const reduxStore = useStore(pageProps.initialReduxState);

  const isLogin = Boolean(reduxStore.getState().user.uid);
  const loginState: LoginContextState = {
    isLogin,
    openLogin() {
      window.location.href = parsePassportRedirectURL();
    },
    withLogin(callback) {
      return (...args) => {
        if (isLogin) {
          callback(...args);
        } else {
          window.location.href = parsePassportRedirectURL();
        }
      };
    },
  };

  // 登陆重定向

  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={reduxStore}>
          <LoginContext.Provider value={loginState}>
            <Component {...pageProps} />
          </LoginContext.Provider>
        </Provider>
      </ThemeProvider>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async (appContext: AppContext) => {
  const { req, res, query, pathname, asPath } = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  const reduxStore = initialiseStore();
  /**
   * 通过 url 传递认证信息，将认证信息设置到 cookie 中，然后重定向到当前页面，并去掉认证参数
   */
  const routeAuth = getAuthByRoute(query);
  if (routeAuth.token && routeAuth.deviceId) {
    const queryString = QueryString.encode(query);
    const path = asPath?.split("?")[0] + (queryString ? `?${queryString}` : "");
    res
      ?.writeHead(302, {
        Location: path,
        "Set-Cookie": [
          `${PASSPORT_TOKEN_KEY}=${routeAuth.token}; path=/;`,
          `${PASSPORT_TENANT_NAME_KEY}=${routeAuth.tenantName}; path=/;`,
          `${PASSPORT_DEVICE_ID_KEY}=${routeAuth.deviceId}; path=/;`,
        ],
      })
      .end();
    return appProps;
  }
  /**
   * 通过cookie传递认证信息
   */
  const { token, deviceId, tenantName } = getAuth(req?.headers.cookie);
  // 是否已经获取用户信息
  const isNoUserInfo = !reduxStore.getState().user.uid;
  // 重定向URL
  const redirectUri = parsePassportRedirectURL(appContext);

  /**
   * 登陆态，未获取用户信息，获取用户信息
   */
  if (isNoUserInfo && token && deviceId && tenantName) {
    try {
      const headers = composeAuthHeaders(req?.headers.cookie);
      const response = await fetchUserInfo({ headers });
      reduxStore.dispatch(setUserInfo(response.data));
    } catch (e) {
      // 获取用户信息失败，代表登陆失效，移除auth相关cookie
      console.error(`[login error]:`, e.response);
      res
        ?.writeHead(302, {
          Location: redirectUri,
          "Set-Cookie": [
            `${PASSPORT_TOKEN_KEY}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            `${PASSPORT_TENANT_NAME_KEY}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            `${PASSPORT_DEVICE_ID_KEY}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          ],
        })
        .end();
      return appProps;
    }
  }
  /**
   * 未登陆态，访问需要登陆页面，重定向到首页
   */
  const isNotLogin = !reduxStore.getState().user.uid;
  if (isNotLogin && needLoginRoutes.includes(pathname)) {
    if (isServer()) {
      res?.writeHead(302, { Location: redirectUri }).end();
      return appProps;
    } else {
      await Router.replace(redirectUri);
      return appProps;
    }
  }

  appProps.pageProps = {
    ...appProps.pageProps,
    initialReduxState: reduxStore.getState(),
  };

  return appProps;
};

export default MyApp;
