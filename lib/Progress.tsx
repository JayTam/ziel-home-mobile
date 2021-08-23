import React from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  transition: width 0.6s ease;
  background-color: ${(props) => props.theme.palette.primary};
`;

interface ProgressProps {
  percentage?: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = (props) => {
  return (
    <ProgressContainer className={props.className}>
      <ProgressBar style={{ width: `${(props.percentage ?? 0) * 100}%` }} />
    </ProgressContainer>
  );
};

Progress.defaultProps = {
  percentage: 0,
};

export default Progress;
