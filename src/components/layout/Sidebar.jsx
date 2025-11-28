import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_MEDIA_MAP } from '../../constants'; 

// --- STYLED COMPONENTS ---

const SidebarWrapper = styled.aside`
  background-color: #1F2937; /* Gray-800 */
  padding: 24px 16px;
  width: 260px;
  border-right: 1px solid #374151; /* Gray-700 */
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: 100%;
  overflow-y: auto;

  /* Thin scrollbar for Webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #1F2937;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #4B5563;
    border-radius: 10px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
`;

const Title = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  color: #9CA3AF; /* Gray-400 */
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Badge = styled.span`
  background-color: #374151;
  color: #D1D5DB;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 99px;
  font-weight: 600;
`;

const FilterList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterItem = styled(motion.li)`
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.isActive ? '#FFFFFF' : '#D1D5DB'};
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#2563EB' : 'transparent'}; /* Blue-600 active */
  border: 1px solid ${props => props.isActive ? '#2563EB' : 'transparent'};
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${props => props.isActive ? '#1D4ED8' : 'rgba(255,255,255,0.05)'};
    color: #FFFFFF;
  }
`;

const EmptyStateContainer = styled(motion.div)`
  padding: 24px 16px;
  text-align: center;
  border: 2px dashed #374151;
  border-radius: 8px;
  background-color: rgba(31, 41, 55, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #9CA3AF;
  line-height: 1.4;
`;

const IconPlaceholder = styled.div`
  font-size: 1.5rem;
  opacity: 0.5;
  margin-bottom: 4px;
`;

// --- COMPONENT ---

const Sidebar = ({
  companies,
  selectedCompany,
  onSelectCompany,
  selectedCategory,
  onSelectCategory
}) => {

  // 1. Derive the categories based on the selected company using the Map from constants
  const displayCategories = selectedCompany ? COMPANY_MEDIA_MAP[selectedCompany] : [];

  // Animation variants for the list items (Stagger effect)
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <SidebarWrapper>
      
      {/* --- COMPANY SECTION --- */}
      <FilterSection>
        <SectionHeader>
          <Title>Companies</Title>
          <Badge>{companies.length}</Badge>
        </SectionHeader>
        
        <FilterList layout>
          {companies.map((company) => (
            <FilterItem
              key={company}
              isActive={company === selectedCompany}
              onClick={() => {
                onSelectCompany(company);
                // Reset category to 'All' (or null) when switching companies
                // so the user doesn't get stuck with a category that doesn't exist for the new company
                if (selectedCompany !== company) {
                   onSelectCategory(''); 
                }
              }}
              whileHover={{ scale: 1.02, originX: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              {company}
              {company === selectedCompany && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  •
                </motion.span>
              )}
            </FilterItem>
          ))}
        </FilterList>
      </FilterSection>

      {/* --- MEDIA TYPES SECTION (Context Aware) --- */}
      <FilterSection>
        <SectionHeader>
          <Title>Media Types</Title>
        </SectionHeader>
        
        <AnimatePresence mode="wait">
          {selectedCompany ? (
            <FilterList
              key={selectedCompany} // Key change triggers re-animation
              variants={listVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
            >
              {/* "All Types" Option */}
              <FilterItem
                variants={itemVariants}
                isActive={!selectedCategory || selectedCategory === 'All'}
                onClick={() => onSelectCategory('')} // or 'All' depending on your API logic
                whileHover={{ x: 4 }}
              >
                All Types
              </FilterItem>

              {/* Mapped Categories for the specific company */}
              {displayCategories && displayCategories.map((category) => (
                <FilterItem
                  key={category}
                  variants={itemVariants}
                  isActive={category === selectedCategory}
                  onClick={() => onSelectCategory(category)}
                  whileHover={{ x: 4 }}
                >
                  {category}
                </FilterItem>
              ))}
            </FilterList>
          ) : (
            // Impressive Empty State
            <EmptyStateContainer
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <IconPlaceholder>👆</IconPlaceholder>
              <EmptyStateText>
                Select a company above<br />to see available media.
              </EmptyStateText>
            </EmptyStateContainer>
          )}
        </AnimatePresence>
      </FilterSection>

    </SidebarWrapper>
  );
};

export default Sidebar;