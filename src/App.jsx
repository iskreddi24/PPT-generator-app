import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import { SelectionProvider } from './context/SelectionContext.jsx';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
// --- FIX 1: Removed HOARDING_TYPES from import ---
import { COMPANIES } from './constants.js';

// Import Pages and Components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout.jsx';
import Modal from './components/common/Modal.jsx';
import AddMediaForm from './components/AddMediaForm.jsx';
import GenerateByCodesModal from './components/media/GenerateByCodesModal.jsx';

function App() {
  // State for the Add/Edit form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState(null);

  // State to manage the "Generate by Codes" modal's visibility
  const [isGenerateByCodesModalOpen, setIsGenerateByCodesModalOpen] = useState(false);

  // State for filters
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]);
  const [selectedMediaType, setSelectedMediaType] = useState('All'); // or '' depending on your preference

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    // Reset media type to 'All' (or empty) when company changes to avoid mismatch
    setSelectedMediaType('All');
  };

  // --- Handlers for the Add/Edit Form Modal ---
  const handleAddMediaClick = () => {
    setMediaToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditMediaClick = (media) => {
    setMediaToEdit(media);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setMediaToEdit(null);
  };

  const handleFormSuccess = () => {
    closeFormModal();
    // Dispatch event to refresh the list in DashboardPage
    window.dispatchEvent(new Event('refreshMedia'));
  };

  return (
    <AuthProvider>
      <SelectionProvider>
        <GlobalStyles />
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout
                  // Pass the new click handler down to the Layout/Header
                  onGenerateByCodesClick={() => setIsGenerateByCodesModalOpen(true)}
                  onAddMediaClick={handleAddMediaClick}
                  
                  // Filter props
                  companies={COMPANIES}
                  selectedCompany={selectedCompany}
                  onSelectCompany={handleSelectCompany}
                  
                  // --- FIX 2: Removed 'categories={HOARDING_TYPES}' prop ---
                  // The Sidebar now calculates available categories internally 
                  // based on the selectedCompany.
                  
                  selectedCategory={selectedMediaType}
                  onSelectCategory={setSelectedMediaType}
                >
                  <DashboardPage
                    onEditClick={handleEditMediaClick}
                    onAddClick={handleAddMediaClick}
                    selectedCompany={selectedCompany}
                    selectedCategory={selectedMediaType}
                  />
                </Layout>

                {/* The existing modal for the Add/Edit form */}
                <Modal 
                  isOpen={isFormModalOpen} 
                  onClose={closeFormModal}
                  closeOnBackdropClick={false} 
                >
                  <AddMediaForm
                    key={mediaToEdit ? `edit-${mediaToEdit.id}` : 'add-new'}
                    onSuccess={handleFormSuccess}
                    onCancel={closeFormModal}
                    mediaToEdit={mediaToEdit}
                  />
                </Modal>

                {/* Render the new modal for our "Generate by Codes" feature */}
                <Modal
                  isOpen={isGenerateByCodesModalOpen}
                  onClose={() => setIsGenerateByCodesModalOpen(false)}
                  closeOnBackdropClick={true} 
                >
                  <GenerateByCodesModal 
                    onClose={() => setIsGenerateByCodesModalOpen(false)} 
                  />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      </SelectionProvider>
    </AuthProvider>
  );
}

export default App;