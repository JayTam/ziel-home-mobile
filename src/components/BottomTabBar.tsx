import React, { useMemo } from "react";
import TabBarItem from "#/lib/TabBarItem";
import HomeDarkActiveIcon from "@/assets/icons/home-dark-active.svg";
import HomeDarkIcon from "@/assets/icons/home-dark.svg";
import CreateIcon from "@/assets/icons/create.svg";
import PersonalDark from "@/assets/icons/personal-dark.svg";
import PersonalDarkActive from "@/assets/icons/personal-dark-active.svg";
import HomeIcon from "@/assets/icons/home.svg";
import HomeActiveIcon from "@/assets/icons/home-active.svg";
import PersonalActive from "@/assets/icons/personal-active.svg";
import Personal from "@/assets/icons/personal.svg";
import TabBar from "#/lib/TabBar";
import { useRouter } from "next/router";
import { useLogin } from "../utils";

interface BottomTabBarProps {
  dark?: boolean;
}

const HOME_ROUTE = "/";
const PAPER_CREATE_ROUTE = "/paper/create";
const PERSONAL_ROUTE = "/personal";

const BottomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const router = useRouter();
  const { withLogin } = useLogin();
  const isHomeRoute = useMemo(() => router.route === HOME_ROUTE, [router.route]);
  const isPersonalRoute = useMemo(() => router.route === PERSONAL_ROUTE, [router.route]);

  const withLoginTo = (routePath: string) => {
    if (router.route !== routePath) withLogin(() => router.push(routePath))();
  };

  return (
    <TabBar dark={props.dark}>
      <TabBarItem onClick={() => withLoginTo(HOME_ROUTE)}>
        {props.dark ? (
          isHomeRoute ? (
            <HomeDarkActiveIcon />
          ) : (
            <HomeDarkIcon />
          )
        ) : isHomeRoute ? (
          <HomeActiveIcon />
        ) : (
          <HomeIcon />
        )}
      </TabBarItem>
      <TabBarItem onClick={() => withLoginTo(PAPER_CREATE_ROUTE)}>
        <CreateIcon />
      </TabBarItem>
      <TabBarItem onClick={() => withLoginTo(PERSONAL_ROUTE)}>
        {props.dark ? (
          isPersonalRoute ? (
            <PersonalDarkActive />
          ) : (
            <PersonalDark />
          )
        ) : isPersonalRoute ? (
          <PersonalActive />
        ) : (
          <Personal />
        )}
      </TabBarItem>
    </TabBar>
  );
};

export default BottomTabBar;
