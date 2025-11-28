// src/components/media/ErrorState.jsx
import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  text-align: center;
`;

const Title = styled.h3`
  color: #F87171; /* Red-400 */
  margin: 12px 0 8px 0;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  max-width: 300px;
`;

const RetryButton = styled.button`
  padding: 10px 16px;
  font-weight: 600;
  color: #fff;
  background: #3B82F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #2563EB; }
`;

const ErrorState = ({ onRetry }) => {
  return (
    <Wrapper>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 7V13" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 17.0195V17" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <Title>Something Went Wrong</Title>
      <Description>We couldn't load the media. Please check your connection and try again.</Description>
      <RetryButton onClick={onRetry}>Retry</RetryButton>
    </Wrapper>
  );
};

export default ErrorState;