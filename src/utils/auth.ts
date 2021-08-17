import Cookies from "universal-cookie";
import { ParsedUrlQuery } from "querystring";
import {
  LANG_KEY,
  PASSPORT_APP_ID_KEY,
  PASSPORT_DEVICE_ID_KEY,
  PASSPORT_SUB_APP_ID_KEY,
  PASSPORT_TENANT_NAME_KEY,
  PASSPORT_TOKEN_KEY,
  REDIRECT_URI_KEY,
  USER_ID_KEY,
} from "../constants";

export const composeAuthHeaders = (reqCookies?: string) => {
  const headers: Record<string, string> = {};
  const { token, deviceId, tenantName } = getAuth(reqCookies);
  if (token) headers["Authorization"] = token;
  if (deviceId) headers["paasport-device-id"] = deviceId;
  if (tenantName) headers["paasport-tenant-name"] = tenantName;
  headers["paasport-app-id"] = process.env.NEXT_PUBLIC_PAASPORT_APP_ID as string;
  return headers;
};

export const setAuth = (token: string, deviceId: string) => {
  const cookies = new Cookies();
  cookies.set(PASSPORT_TOKEN_KEY, token, { path: "/" });
  cookies.set(PASSPORT_DEVICE_ID_KEY, deviceId, { path: "/" });
  cookies.set(PASSPORT_TENANT_NAME_KEY, process.env.NEXT_PUBLIC_PAASPORT_APP_ID, { path: "/" });
  return null;
};

export const getAuth = (
  reqCookies?: string
): { token?: string; deviceId?: string; tenantName?: string } => {
  const cookies = new Cookies(reqCookies);
  const token = cookies.get(PASSPORT_TOKEN_KEY);
  const deviceId = cookies.get(PASSPORT_DEVICE_ID_KEY);
  const tenantName = process.env.NEXT_PUBLIC_PAASPORT_TENANT_NAME;
  return {
    token: token,
    deviceId: deviceId,
    tenantName: tenantName,
  };
};

export const getAuthByRoute = (routeQuery?: ParsedUrlQuery) => {
  const authObj = {
    token: routeQuery?.[PASSPORT_TOKEN_KEY],
    deviceId: routeQuery?.[PASSPORT_DEVICE_ID_KEY],
    tenantName: process.env.NEXT_PUBLIC_PAASPORT_TENANT_NAME,
  };
  if (routeQuery) {
    delete routeQuery[PASSPORT_TOKEN_KEY];
    delete routeQuery[PASSPORT_DEVICE_ID_KEY];
    delete routeQuery[PASSPORT_SUB_APP_ID_KEY];
    delete routeQuery[PASSPORT_APP_ID_KEY];
    delete routeQuery[USER_ID_KEY];
    delete routeQuery[REDIRECT_URI_KEY];
    delete routeQuery[LANG_KEY];
  }
  return authObj;
};

export const removeAuth = () => {
  const cookies = new Cookies();
  cookies.remove(PASSPORT_TOKEN_KEY);
  cookies.remove(PASSPORT_DEVICE_ID_KEY);
  cookies.remove(PASSPORT_TENANT_NAME_KEY);
};
