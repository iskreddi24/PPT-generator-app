import { useState } from 'react';
import styled from '@emotion/styled';
import { generatePptByCodes } from '../../api/mediaService';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

// --- Styled Components ---
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #F9FAFB;
`;

const Description = styled.p`
  color: #D1D5DB;
  margin: -12px 0 0 0;
  font-size: 0.9rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px;
  font-size: 1rem;
  font-family: inherit;
  color: #F9FAFB;
  background-color: #374151;
  border: 1px solid #4B5563;
  border-radius: 8px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #16A34A;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    background: #4B5563;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const CancelButton = styled(Button)`
  background-color: #4B5563;
`;


const GenerateByCodesModal = ({ onClose }) => {
  const [mediaCodes, setMediaCodes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Split the textarea content by new lines, spaces, or commas, and trim whitespace
    const codes = mediaCodes.split(/[\n\s,]+/).filter(code => code.trim() !== '');

    if (codes.length === 0) {
      toast.error('Please enter at least one media code.');
      return;
    }

    setIsGenerating(true); // THIS IS WHERE THE CLEAR MESSAGE STARTS
    toast.loading('Generating presentation...', { id: 'ppt-generation' }); // Show a persistent loading toast

    try {
      const response = await generatePptByCodes(codes);

      // Trigger the file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation_by_codes.pptx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Presentation generated successfully!', { id: 'ppt-generation' });
      onClose(); // Close the modal on success

    } catch (error) {
      console.error("Failed to download the presentation by codes.", error);
      toast.error('Failed to generate presentation. Please check the codes.', { id: 'ppt-generation' });
    } finally {
      setIsGenerating(false); // The process is finished
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Generate PPT from Media Codes</Title>
      <Description>
        Enter a list of media codes separated by spaces, commas, or new lines.
      </Description>
      
      <TextArea
        value={mediaCodes}
        onChange={(e) => setMediaCodes(e.target.value)}
        placeholder="e.g., SBA001, SBA002 YUVA005..."
        disabled={isGenerating}
      />

      <ButtonRow>
        <CancelButton type="button" onClick={onClose} disabled={isGenerating}>
          Cancel
        </CancelButton>
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Spinner size={20} thickness={2} color="#fff" />
              Generating...
            </>
          ) : (
            'Generate Presentation'
          )}
        </Button>
      </ButtonRow>
    </Form>
  );
};

export default GenerateByCodesModal;