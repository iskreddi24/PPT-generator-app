import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledSpinner = styled.span`
  display: inline-block;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

const Spinner = ({ size = 20, thickness = 3, color = '#3B82F6', ariaLabel }) => {
  const style = {
    width: size,
    height: size,
    border: `${thickness}px solid rgba(255,255,255,0.08)`,
    borderTopColor: color,
  };

  return (
    <StyledSpinner
      role="status"
      aria-label={ariaLabel || 'Loading'}
      style={style}
    />
  );
};

export default Spinner;
