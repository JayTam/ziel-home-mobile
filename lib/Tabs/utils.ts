import React from "react";
import { isFragment } from "react-is";
import { Tab, TabPanelProps } from "./interface";

export interface Option {
  keepEmpty?: boolean;
}

export default function toArray(
  children: React.ReactNode,
  option: Option = {}
): React.ReactElement[] {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });

  return ret;
}

export function parseTabList(children: React.ReactNode): Tab[] {
  return (
    toArray(children)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map<Tab>((node: React.ReactElement<TabPanelProps>) => {
        if (React.isValidElement(node)) {
          const key = node.key !== undefined ? String(node.key) : undefined;
          return {
            key,
            ...node.props,
            node,
          };
        }

        return null;
      })
      .filter((tab) => tab)
  );
}
