import { useState, useEffect, useCallback, useRef, useReducer, useMemo } from 'react';
import { getMedia } from '../api/mediaService';
import useDebounce from '../hooks/useDebounce';
import styled from '@emotion/styled';
import { useSelection } from '../context/SelectionContext.jsx';
import { useVirtualizer } from '@tanstack/react-virtual';

import MediaList from '../components/media/MediaList.jsx';
import SearchBar from '../components/media/SearchBar.jsx';
import Spinner from '../components/common/Spinner.jsx';
import MediaCardSkeleton from '../components/media/MediaCardSkeleton.jsx';
import ErrorState from '../components/media/ErrorState.jsx';

// --- Styled Components (No changes) ---
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
`;
const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  flex-shrink: 0;
`;
const ResultsText = styled.div`
  color: #9CA3AF;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 24px;
`;
const SelectAllWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #D1D5DB;
  cursor: pointer;
  user-select: none;
`;
const ScrollContainer = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

// --- State Reducer (No changes) ---
const initialState = { status: 'loading', media: [], page: 0, hasMore: true, totalElements: 0, error: null };
function mediaReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT': return { ...initialState, status: 'loading' }; // On new filter, reset EVERYTHING
    case 'FETCH_MORE': return { ...state, status: 'loading', page: state.page + 1 };
    case 'FETCH_SUCCESS': return { ...state, status: 'success', media: state.page === 0 ? action.payload.content : [...state.media, ...action.payload.content], hasMore: !action.payload.last, totalElements: action.payload.totalElements };
    case 'FETCH_FAILURE': return { ...state, status: 'error', error: action.payload };
    default: throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const DashboardPage = ({ onEditClick, onAddClick, selectedCompany, selectedCategory }) => {
  const [state, dispatch] = useReducer(mediaReducer, initialState);
  const { status, media, page, hasMore, totalElements } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const parentRef = useRef();

  // --- Grid calculation logic (No changes) ---
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => entries[0] && setContainerWidth(entries[0].contentRect.width));
    if (parentRef.current) resizeObserver.observe(parentRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  const { columnCount, gridItems } = useMemo(() => {
    const CARD_MIN_WIDTH = 260, GAP = 20;
    const calculatedCols = Math.max(1, Math.floor((containerWidth - GAP) / (CARD_MIN_WIDTH + GAP)));
    const chunkedItems = [];
    for (let i = 0; i < media.length; i += calculatedCols) chunkedItems.push(media.slice(i, i + calculatedCols));
    return { columnCount: calculatedCols, gridItems: chunkedItems };
  }, [containerWidth, media]);
  
  // --- Virtualizer (No changes) ---
  const rowVirtualizer = useVirtualizer({
    count: gridItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 370,
    overscan: 5,
  });

  // ======================================================================
  // START: THE CORE FIX - CONSOLIDATED USEEFFECT LOGIC
  // ======================================================================

  // 1. This effect is ONLY responsible for resetting the state when filters change.
  useEffect(() => {
    // When any filter changes, we dispatch a single action to reset everything.
    // This will set the page back to 0 and status to 'loading'.
    dispatch({ type: 'FETCH_INIT' });
  }, [selectedCompany, selectedCategory, debouncedSearchQuery]);


  // 2. This is now the ONLY effect responsible for FETCHING data.
  // It runs whenever the status is 'loading'.
  useEffect(() => {
    // If the component is not in a loading state, do nothing.
    if (status !== 'loading') return;

    const abortController = new AbortController();
    const fetchApi = async () => {
      try {
        // It always uses the current 'page' from the state.
        const data = await getMedia(selectedCompany, selectedCategory, debouncedSearchQuery, page, abortController.signal);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        if (error.name !== 'CanceledError') {
          dispatch({ type: 'FETCH_FAILURE', payload: error });
        }
      }
    };
    
    fetchApi();

    // Cleanup function to cancel the request if filters change mid-flight.
    return () => abortController.abort();
  }, [status, page, selectedCompany, selectedCategory, debouncedSearchQuery]); // Dependencies ensure it has the latest data.

  // ======================================================================
  // END: THE CORE FIX
  // ======================================================================

  // --- Infinite Scrolling trigger (No changes) ---
  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (lastItem.index >= gridItems.length - 1 && hasMore && status !== 'loading') {
      dispatch({ type: 'FETCH_MORE' });
    }
  }, [virtualItems, gridItems.length, hasMore, status]);

  // --- Global Refresh Handler (Simplified) ---
  const handleGlobalRefresh = useCallback(() => dispatch({ type: 'FETCH_INIT' }), []);
  useEffect(() => {
    window.addEventListener('refreshMedia', handleGlobalRefresh);
    return () => window.removeEventListener('refreshMedia', handleGlobalRefresh);
  }, [handleGlobalRefresh]);

  // --- Selection Logic (No changes) ---
  const { selectedIds, selectAll, deselectAll } = useSelection();
  const selectAllRef = useRef(null);
  const allMediaIds = media.map(item => item.id);
  const areAllVisibleSelected = allMediaIds.length > 0 && allMediaIds.every(id => selectedIds.includes(id));
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = allMediaIds.some(id => selectedIds.includes(id)) && !areAllVisibleSelected;
  }, [selectedIds, allMediaIds, areAllVisibleSelected]);
  const handleSelectAllClick = () => areAllVisibleSelected ? deselectAll(allMediaIds) : selectAll(allMediaIds);
  
  // --- Render Logic (No changes) ---
  const renderContent = () => {
    if (status === 'loading' && page === 0) {
      return (
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: `repeat(${columnCount || 4}, 1fr)`, gap: '20px' }}>
          {Array.from({ length: columnCount * 3 || 12 }).map((_, i) => <MediaCardSkeleton key={i} />)}
        </div>
      );
    }
    if (status === 'error') return <ErrorState onRetry={() => dispatch({ type: 'FETCH_INIT' })} />;
    
    return (
      <MediaList
        gridItems={gridItems}
        columnCount={columnCount}
        virtualizer={rowVirtualizer}
        onEditClick={onEditClick}
        onAddClick={onAddClick}
        searchQuery={debouncedSearchQuery}
        isLoadingMore={status === 'loading' && page > 0}
        hasMore={hasMore}
      />
    );
  };

  return (
    <Content>
      <ControlsRow>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ResultsText>
          {status === 'success' && media.length > 0 && (
            <SelectAllWrapper>
              <input type="checkbox" ref={selectAllRef} checked={areAllVisibleSelected} onChange={handleSelectAllClick}/>
              Select All Loaded
            </SelectAllWrapper>
          )}
          {status !== 'loading' && status !== 'error' && (
             <span>{totalElements} result{totalElements !== 1 ? 's' : ''}</span>
          )}
        </ResultsText>
      </ControlsRow>
      <ScrollContainer ref={parentRef}>
        {renderContent()}
      </ScrollContainer>
    </Content>
  );
};

export default DashboardPage;