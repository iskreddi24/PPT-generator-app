import React from 'react';
import styled from '@emotion/styled';

// --- No changes to styled components ---
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
  color: #F3F4F6;
  margin: 12px 0 8px 0;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  max-width: 400px;
`;

const CTAButton = styled.button`
  padding: 10px 16px;
  font-weight: 600;
  color: #fff;
  background: #3B82F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #2563EB; }
`;
// --- End of styled components ---


// 1. Update the function signature to accept the `searchQuery` prop.
const EmptyState = ({ onAddClick, searchQuery }) => {
  // 2. Determine if the empty state is because of an active search.
  const isSearching = searchQuery && searchQuery.trim().length > 0;

  return (
    <Wrapper>
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 7.5C3 6.11929 4.11929 5 5.5 5H18.5C19.8807 5 21 6.11929 21 7.5V16.5C21 17.8807 19.8807 19 18.5 19H5.5C4.11929 19 3 17.8807 3 16.5V7.5Z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10H16" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 14H12" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* 3. Conditionally render the title and description based on whether a search is active. */}
      <Title>{isSearching ? 'No results found' : 'No media yet'}</Title>
      <Description>
        {isSearching 
          ? `We couldn't find any media matching "${searchQuery}". Try a different search or clear the filters.`
          : 'Get started by adding your first media item or select a different filter.'
        }
      </Description>
      
      {/* 4. Only show the "Add New Media" button when the user is not actively searching. */}
      {!isSearching && onAddClick && (
        <CTAButton onClick={onAddClick}>Add New Media</CTAButton>
      )}
    </Wrapper>
  );
};

export default EmptyState;