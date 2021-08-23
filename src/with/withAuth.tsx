import { NextPage, NextPageContext } from "next";

interface AnyProps {
  [key: string]: any;
}

// eslint-disable-next-line react/display-name
const withAuth = (Component: NextPage) => (props: AnyProps) => {
  Component.getInitialProps?.((pageContext: NextPageContext) => {
    const { req } = pageContext;
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  });
  return <Component {...props} />;
};

export default withAuth;
