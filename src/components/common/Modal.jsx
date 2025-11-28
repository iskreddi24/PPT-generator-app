// src/components/common/Modal.jsx
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled(motion.div)`
  background-color: #1F2937; /* Gray-800 */
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9CA3AF; /* Gray-400 */
  cursor: pointer;
  &:hover {
    color: #F9FAFB; /* Gray-50 */
  }
`;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

// ======================================================================
// THE FIX IS HERE: We add a new prop with a default value of true.
// ======================================================================
const Modal = ({ isOpen, onClose, children, closeOnBackdropClick = true }) => {
  
  // A new handler function for the backdrop click.
  const handleBackdropClick = () => {
    // Only call the onClose function if the prop allows it.
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          // The backdrop now calls our new, conditional handler.
          onClick={handleBackdropClick}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          {/* This part remains the same */}
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.18 }}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>
            {children}
          </ModalContent>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default Modal;