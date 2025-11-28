import React from 'react';
import styled from '@emotion/styled';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

// --- No changes to styled components ---
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; /* Important for scrolling */
`;

const PageContent = styled.div`
  flex: 1;
  overflow-y: auto; /* Allow main content to scroll */
`;

const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

const Main = styled.main`
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  margin-top: 16px;
  overflow: hidden;
`;

const Layout = ({
  children,
  onAddMediaClick,
  onGenerateByCodesClick, // 1. THE FIX: Accept the new prop from App.jsx
  // Filter props
  companies,
  selectedCompany,
  onSelectCompany,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <AppContainer>
      {/* 2. THE FIX: Pass the received prop down to the Header component */}
      <Header 
        onAddMediaClick={onAddMediaClick} 
        onGenerateByCodesClick={onGenerateByCodesClick}
      />
      <MainContentWrapper>
        {/* The Sidebar props are correct and remain unchanged */}
        <Sidebar
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
        <PageContent>
          <PageWrapper>
            <Main>{children}</Main>
          </PageWrapper>
        </PageContent>
      </MainContentWrapper>
    </AppContainer>
  );
};

export default Layout;