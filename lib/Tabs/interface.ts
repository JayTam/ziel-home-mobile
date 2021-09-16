import React from "react";

export interface TabsProps {
  activeKey?: string;
  className?: string;
  tabBar?: boolean;
  barWidth?: number;
  barColor?: string;
  center?: boolean;
  sticky?: boolean;
  fixed?: boolean;
  space?: number;
  // tab list 样式风格
  tabStyle?: "contain" | "default" | "dot" | "line";
  onChange?: (activeKey: string) => void;
}

export interface TabPanelProps {
  indexKey: string;
  className?: string;
  tab?: string;
  forceRender?: boolean;
  children?: React.ReactNode;
}

export interface Tab extends TabPanelProps {
  key: string;
  node: React.ReactElement;
}

export interface TabsContextProps {
  activeKey?: string;
}
