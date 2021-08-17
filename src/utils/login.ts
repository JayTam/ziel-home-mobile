import { createContext, useContext } from "react";

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
