import React from "react";

export interface TabsProps {
  activeKey?: string;
  barWidth?: number;
  onChange?: (activeKey: string) => void;
}

export interface TabPanelProps {
  indexKey: string;
  className?: string;
  tab?: string;
  children?: React.ReactNode;
}

export interface Tab extends TabPanelProps {
  key: string;
  node: React.ReactElement;
}
