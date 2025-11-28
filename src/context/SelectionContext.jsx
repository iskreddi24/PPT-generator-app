// src/context/SelectionContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Create the context
const SelectionContext = createContext();

// 2. Create the Provider component
export const SelectionProvider = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState([]); // Holds the array of selected media IDs

  // Function to add or remove an ID from the selection
  const toggleSelection = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        // If it is, filter it out (deselect)
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        // If it's not, add it to the array (select)
        return [...prevSelectedIds, id];
      }
    });
  };

  // ======================================================================
  // START: NEW FUNCTIONS FOR "SELECT ALL" FEATURE
  // ======================================================================

  /**
   * Adds an array of IDs to the current selection, ignoring duplicates.
   * This is how we will handle cumulative selections.
   * @param {Array<number>} idsToAdd - An array of media IDs to select.
   */
  const selectAll = (idsToAdd) => {
    setSelectedIds((prevSelectedIds) => {
      // Using a Set is the most efficient way to merge and remove duplicates
      const combinedIds = new Set([...prevSelectedIds, ...idsToAdd]);
      return Array.from(combinedIds);
    });
  };

  /**
   * Removes an array of IDs from the current selection.
   * @param {Array<number>} idsToRemove - An array of media IDs to deselect.
   */
  const deselectAll = (idsToRemove) => {
    setSelectedIds((prevSelectedIds) => {
      const idsToRemoveSet = new Set(idsToRemove);
      return prevSelectedIds.filter((id) => !idsToRemoveSet.has(id));
    });
  };

  // ======================================================================
  // END: NEW FUNCTIONS
  // ======================================================================


  // The value that will be available to all consuming components
  // FIX: Add the new functions to the context value
  const value = { selectedIds, toggleSelection, selectAll, deselectAll };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
// eslint-disable-next-line react-refresh/only-export-components
export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};