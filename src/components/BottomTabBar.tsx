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
import Link from "next/link";

interface BottomTabBarProps {
  dark?: boolean;
}

const HOME_ROUTE = "/";
const PERSONAL_ROUTE = "/personal";
const PAPER_CREATE_ROUTE = "/paper/create";

const BottomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const router = useRouter();
  const isHomeRoute = useMemo(() => router.asPath === HOME_ROUTE, [router.asPath]);
  const isPersonalRoute = useMemo(() => router.asPath === PERSONAL_ROUTE, [router.asPath]);

  return (
    <TabBar dark={props.dark}>
      <Link href={HOME_ROUTE}>
        <TabBarItem>
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
      </Link>
      <Link href={PAPER_CREATE_ROUTE}>
        <TabBarItem>
          <CreateIcon style={{ position: "relative", bottom: -5 }} />
        </TabBarItem>
      </Link>
      <Link href={PERSONAL_ROUTE}>
        <TabBarItem>
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
      </Link>
    </TabBar>
  );
};

export default BottomTabBar;
