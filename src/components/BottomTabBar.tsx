import React, { useMemo } from "react";
import TabBarItem from "../../lib/TabBarItem";
import HomeDarkActiveIcon from "../assets/icons/home-dark-active.svg";
import HomeDarkIcon from "../assets/icons/home-dark.svg";
import CreateIcon from "../assets/icons/create.svg";
import PersonalDark from "../assets/icons/personal-dark.svg";
import PersonalDarkActive from "../assets/icons/personal-dark-active.svg";
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
    <TabBar>
      <Link href={HOME_ROUTE}>
        <TabBarItem>
          {props.dark ? isHomeRoute ? <HomeDarkActiveIcon /> : <HomeDarkIcon /> : null}
        </TabBarItem>
      </Link>
      <Link href={PAPER_CREATE_ROUTE}>
        <TabBarItem>
          <CreateIcon style={{ position: "relative", bottom: -5 }} />
        </TabBarItem>
      </Link>
      <Link href={PERSONAL_ROUTE}>
        <TabBarItem>
          {props.dark ? isPersonalRoute ? <PersonalDarkActive /> : <PersonalDark /> : null}
        </TabBarItem>
      </Link>
    </TabBar>
  );
};

export default BottomTabBar;
