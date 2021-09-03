import React, { useMemo } from "react";
import TabBarItem from "../../lib/TabBarItem";
import HomeDarkActiveIcon from "../assets/icons/home-dark-active.svg";
import HomeDarkIcon from "../assets/icons/home-dark.svg";
import CreateIcon from "../assets/icons/create.svg";
import PersonalDark from "../assets/icons/personal-dark.svg";
import PersonalDarkActive from "../assets/icons/personal-dark-active.svg";
import HomeIcon from "../assets/icons/home.svg";
import HomeActiveIcon from "../assets/icons/home-active.svg";
import PersonalActive from "../assets/icons/personal-active.svg";
import Personal from "../assets/icons/personal.svg";
import TabBar from "../../lib/TabBar";
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
  const isHomeRoute = useMemo(() => router.asPath === HOME_ROUTE, [router.asPath]);
  const isPersonalRoute = useMemo(() => router.asPath === PERSONAL_ROUTE, [router.asPath]);

  const toHomeRoute = withLogin(() => router.push(HOME_ROUTE));
  const toCreateRoute = withLogin(() => router.push(PAPER_CREATE_ROUTE));
  const toPersonalRoute = withLogin(() => router.push(PERSONAL_ROUTE));

  return (
    <TabBar dark={props.dark}>
      <TabBarItem onClick={toHomeRoute}>
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
      <TabBarItem onClick={toCreateRoute}>
        <CreateIcon />
      </TabBarItem>
      <TabBarItem onClick={toPersonalRoute}>
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
