import Cookies from "universal-cookie";
import { ParsedUrlQuery } from "querystring";

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
  cookies.set("paasport-token", token, { path: "/" });
  cookies.set("paasport-device-id", deviceId, { path: "/" });
  cookies.set("paasport-tenant-name", process.env.NEXT_PUBLIC_PAASPORT_APP_ID, { path: "/" });
  return null;
};

export const getAuth = (
  reqCookies?: string
): { token?: string; deviceId?: string; tenantName?: string } => {
  const cookies = new Cookies(reqCookies);
  const token = cookies.get("paasport-token");
  const deviceId = cookies.get("paasport-device-id");
  const tenantName = process.env.NEXT_PUBLIC_PAASPORT_TENANT_NAME;
  return {
    token: token,
    deviceId: deviceId,
    tenantName: tenantName,
  };
};

export const getAuthByRoute = (routeQuery?: ParsedUrlQuery) => {
  const authObj = {
    token: routeQuery?.token,
    deviceId: routeQuery?.["device_id"],
    tenantName: process.env.NEXT_PUBLIC_PAASPORT_TENANT_NAME,
  };
  if (routeQuery) {
    delete routeQuery["token"];
    delete routeQuery["device_id"];
    delete routeQuery["app_id"];
    delete routeQuery["sub_app_id"];
    delete routeQuery["user_id"];
    delete routeQuery["redirect_uri"];
    delete routeQuery["lang"];
  }
  return authObj;
};

export const removeAuth = () => {
  const cookies = new Cookies();
  cookies.remove("paasport-token");
  cookies.remove("paasport-device-id");
  cookies.remove("paasport-tenant-name");
};
