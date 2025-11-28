import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useSelection } from '../context/SelectionContext.jsx'; 
import { memo, useCallback, useState, useEffect } from 'react'; // Added useState, useEffect

// --- Styled Components ---

const CardWrapper = styled(motion.div)`
  background-color: #1F2937;
  border: ${props => props.isSelected ? '3px solid #3B82F6' : '1px solid #4B5563'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  will-change: transform, box-shadow;
  transform: ${props => props.isSelected ? 'translateY(-5px)' : 'none'};
  box-shadow: ${props => props.isSelected ? '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  aspect-ratio: 16 / 9;
  
  @supports not (aspect-ratio: 16 / 9) {
    height: 200px;
  }
  
  /* Add a subtle transition for when the image source swaps */
  transition: opacity 0.2s;
`;

const CardBody = styled.div`
  padding: 16px;
  position: relative;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #F9FAFB;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardText = styled.p`
  margin: 0 0 6px 0;
  font-size: 0.875rem;
  color: #D1D5DB;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(31, 41, 55, 0.7);
  border: 1px solid #4B5563;
  color: #D1D5DB;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #3B82F6;
    color: white;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  color: #9CA3AF;
  flex-shrink: 0;
`;

// --- The React Component ---
const MediaCard = memo(({ media, onEditClick }) => {
  const { selectedIds, toggleSelection } = useSelection();
  const isSelected = selectedIds.includes(media.id);
  const BASE_URL = "http://192.168.0.204:8080/uploads/";

  // STATE: Manage the current image URL and which extensions we have tried
  const [imgSrc, setImgSrc] = useState(`${BASE_URL}${media.imagePath}`);
  const [triedExtensions, setTriedExtensions] = useState([]);

  // Reset state if the media prop changes (e.g. while filtering)
  useEffect(() => {
    setImgSrc(`${BASE_URL}${media.imagePath}`);
    setTriedExtensions([]);
  }, [media.imagePath]);

  // IMAGE ERROR HANDLER
  const handleImageError = () => {
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    // 1. Get the current filename without path
    const filename = media.imagePath; 
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) return; // No extension to swap

    const baseName = filename.substring(0, dotIndex); // e.g., SBA001
    const originalExt = filename.substring(dotIndex + 1).toLowerCase(); // e.g., jpg

    // 2. Determine which extension to try next
    // We filter out the original extension and any we have already tried
    const remainingExtensions = supportedExtensions.filter(
      ext => ext !== originalExt && !triedExtensions.includes(ext)
    );

    if (remainingExtensions.length > 0) {
      const nextExt = remainingExtensions[0];
      const nextUrl = `${BASE_URL}${baseName}.${nextExt}`;
      
      // Update state to try the new URL
      setTriedExtensions(prev => [...prev, nextExt]);
      setImgSrc(nextUrl);
      console.log(`Image failed, retrying with: ${nextUrl}`);
    } else {
      // 3. All Fallbacks Failed: Set a placeholder image
      setImgSrc("https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg");
    }
  };

  const handleCardClick = useCallback(() => {
    toggleSelection(media.id);
  }, [media.id, toggleSelection]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSelection(media.id);
    }
  }, [media.id, toggleSelection]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    if (typeof onEditClick === 'function') {
      onEditClick(media);
    }
  }, [media, onEditClick]);

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <CardWrapper
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      isSelected={isSelected}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Media ${media.mediaCode}. ${media.location || ''} ${media.city || ''}`}
      variants={itemVariants}
    >
      <CardImage 
        src={imgSrc} 
        alt={media.mediaCode || 'media image'} 
        loading="lazy"
        decoding="async"
        onError={handleImageError} // <--- The magic happens here
      />
      
      <CardBody>
        <EditButton onClick={handleEditClick} title={`Edit ${media.mediaCode}`}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.26 3.59997L5.05001 11.81C4.66001 12.2 4.47001 12.72 4.50001 13.25L4.89001 18.01C4.96001 18.92 5.70001 19.65 6.61001 19.72L11.37 20.11C11.9 20.14 12.42 19.95 12.81 19.56L21.02 11.35C22.48 9.89001 22.1 7.64001 20.3 6.38001C18.52 5.12001 16.27 5.51001 14.81 6.97001L13.26 3.59997Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.89 5.05005L19.56 12.72" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </EditButton>
        <CardTitle title={media.mediaCode}>{media.mediaCode}</CardTitle>
        <CardText title={media.location}><strong>Location:</strong> {media.location}</CardText>
        <CardText title={media.trafficView}>
          <IconWrapper>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.582 12.0001C15.582 13.982 13.982 15.5821 12 15.5821C10.018 15.5821 8.41801 13.982 8.41801 12.0001C8.41801 10.0181 10.018 8.41807 12 8.41807C13.982 8.41807 15.582 10.0181 15.582 12.0001Z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 20.271C17.523 20.271 22.049 16.51 22 12.0001C21.951 7.49008 17.523 3.72908 12 3.72908C6.477 3.72908 1.951 7.49008 2 12.0001C2.049 16.51 6.477 20.271 12 20.271Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </IconWrapper>
          <span>{media.trafficView}</span>
        </CardText>
        <CardText title={media.city}><strong>City:</strong> {media.city}</CardText>
        <CardText title={media.specifications}><strong>Size:</strong> {media.specifications}</CardText>
      </CardBody>
    </CardWrapper>
  );
});

export default MediaCard;