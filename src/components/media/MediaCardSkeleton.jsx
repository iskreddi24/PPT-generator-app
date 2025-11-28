// src/components/media/MediaCardSkeleton.jsx
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SkeletonWrapper = styled.div`
  background-color: #1F2937;
  border: 1px solid #4B5563;
  border-radius: 8px;
  overflow: hidden;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #374151;
`;

const SkeletonBody = styled.div`
  padding: 16px;
`;

const SkeletonLine = styled.div`
  background-color: #374151;
  border-radius: 4px;
  height: ${props => props.height || '1em'};
  width: ${props => props.width || '100%'};
  margin-bottom: 10px;
`;

const MediaCardSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonImage />
    <SkeletonBody>
      <SkeletonLine height="1.5em" width="60%" />
      <SkeletonLine width="80%" />
      <SkeletonLine width="70%" />
      <SkeletonLine width="75%" />
    </SkeletonBody>
  </SkeletonWrapper>
);

export default MediaCardSkeleton;