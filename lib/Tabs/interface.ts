import React from "react";

export interface TabsProps {
  activeKey?: string;
  className?: string;
  barWidth?: number;
  isSecondary?: boolean;
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
