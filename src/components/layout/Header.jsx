// src/components/layout/Header.jsx
import styled from '@emotion/styled';
import { useSelection } from '../../context/SelectionContext.jsx';
import { generatePpt } from '../../api/mediaService.js';
import { useState } from 'react';
import Spinner from '../common/Spinner.jsx';
import toast from 'react-hot-toast';

// --- Styled Components ---

const HeaderWrapper = styled.header`
  background-color: #1F2937; /* Gray-800 */
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #374151; /* Gray-700 */
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #F9FAFB; /* Gray-50 */
  margin: 0;
`;

// This button's style will change based on its 'disabled' prop
const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  background-color: #16A34A; /* Green-600 */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;

  &:hover {
    background-color: #15803D; /* Green-700 */
  }

  /* Styles for when the button is disabled */
  &:disabled {
    background-color: #4B5563; /* Gray-600 */
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// --- React Component ---

const Header = ({ onAddMediaClick, onGenerateByCodesClick }) => {
  const { selectedIds } = useSelection();
  const isDisabled = selectedIds.length === 0;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = async () => {
    if (isDisabled || isGenerating) return;

    setIsGenerating(true);
    toast.loading('Generating presentation from selection...', { id: 'ppt-selection' });
    try {
      const response = await generatePpt(selectedIds);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Presentation generated successfully!', { id: 'ppt-selection' });
    } catch (error) {
      console.error("Failed to download the presentation.", error);
      toast.error('Failed to generate presentation.', { id: 'ppt-selection' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <HeaderWrapper>
      <Title>Media Dashboard</Title>
      <div style={{ display: 'flex', gap: '16px' }}>
        
        {/* 2. ADD THE NEW BUTTON HERE */}
        <ActionButton onClick={onGenerateByCodesClick} style={{backgroundColor: '#9333EA'}}>
          Generate from Codes
        </ActionButton>

        <ActionButton onClick={onAddMediaClick} style={{backgroundColor: '#3B82F6'}}>
          Add New Media
        </ActionButton>

        <ActionButton onClick={handleGenerateClick} disabled={isDisabled || isGenerating} aria-busy={isGenerating}>
          {isGenerating ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Spinner size={14} />
              Generating...
            </span>
          ) : (
            <>Generate from Selection ({selectedIds.length})</>
          )}
        </ActionButton>

      </div>
    </HeaderWrapper>
  );
};

export default Header;