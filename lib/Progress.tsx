import React, { useMemo } from "react";
import styled from "styled-components";
import { VerticalHorizontalCenterMixin } from "#/lib/mixins";

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const LinerProgressBar = styled.div`
  height: 100%;
  transition: width 0.6s ease;
  background-color: ${(props) => props.theme.palette.primary};
`;

const CycleProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CycleProgressText = styled.p`
  font-size: 14px;
  line-height: 16px;
  ${VerticalHorizontalCenterMixin}
`;

const SVG = styled.svg`
  transform: rotate(-90deg);
`;

const SVGCircle = styled.circle<{ color?: string }>`
  transition: stroke-dashoffset 1s linear;
  stroke: ${(props) => props.color ?? props.theme.palette.primary};
  stroke-dashoffset: 0;
  stroke-width: 4px;
`;

const Tips = styled.p<{ color?: string }>`
  width: 80%;
  margin: 14px auto;
  text-align: center;
  color: ${(props) => props.color ?? props.theme.palette.primary};
  font-size: 14px;
  line-height: 16px;
`;

interface ProgressProps {
  percentage?: number;
  className?: string;
  type?: "liner" | "cycle";
  initialText?: string;
  progressText?: string;
  size?: number;
  color?: string;
}

const Progress: React.FC<ProgressProps> = (props) => {
  // 百分比
  const { percentage = 0, size = 100, color, initialText, progressText } = props;
  // 半径
  const r = size / 2 - 10;
  // 周长
  const c = Math.PI * 2 * r;
  // 显示在界面的百分比
  const percentageText = useMemo(() => {
    return (percentage * 100).toFixed(0) + "%";
  }, [percentage]);

  const tipsText = useMemo(() => {
    if (percentage === 0) {
      return initialText;
    } else {
      return progressText;
    }
  }, [initialText, percentage, progressText]);

  return (
    <ProgressContainer className={props.className}>
      {props.type === "cycle" ? (
        <CycleProgressBar>
          <CycleProgressText style={{ color: color }}>{percentageText}</CycleProgressText>
          <SVG
            id="svg"
            width={size}
            height={size}
            viewTarget="0 0 100 100"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <SVGCircle
              id="bar"
              r={size / 2 - 10}
              cx={size / 2}
              cy={size / 2}
              fill="transparent"
              strokeDasharray={`${percentage * c} ${(1 - percentage) * c}`}
              strokeDashoffset="0"
              color={color}
            />
          </SVG>
        </CycleProgressBar>
      ) : null}
      {props.type === "liner" ? (
        <LinerProgressBar style={{ width: `${percentage * 100}%` }} />
      ) : null}
      <Tips color={color}>{tipsText}</Tips>
    </ProgressContainer>
  );
};

Progress.defaultProps = {
  percentage: 0,
  type: "cycle",
  size: 60,
  color: "#fff",
  initialText: "initial...",
  progressText: "loading...",
};

export default Progress;
