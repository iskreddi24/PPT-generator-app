import styled from '@emotion/styled';
import MediaCard from '../MediaCard.jsx';
import EmptyState from './EmptyState.jsx';
import Spinner from '../common/Spinner.jsx';

const ListContainer = styled.div`
  width: 100%;
  position: relative;
`;

// This wrapper is for the virtualized *row*
const VirtualRowWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0 24px;
`;

// NEW: This component will layout the cards *within* a single row
const GridRow = styled.div`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columnCount}, 1fr)`};
  gap: 20px;
  padding-bottom: 20px;
`;

const ListFooter = styled.div`
  padding: 32px;
  text-align: center;
  color: #6B7280;
`;

// The component now accepts `gridItems` and `columnCount`
const MediaList = ({
  gridItems,
  columnCount,
  virtualizer,
  onAddClick,
  onEditClick,
  searchQuery,
  isLoadingMore,
  hasMore
}) => {
  const virtualRows = virtualizer.getVirtualItems();

  if (gridItems.length === 0) {
    return <EmptyState onAddClick={onAddClick} searchQuery={searchQuery} />;
  }

  return (
    <ListContainer style={{ height: `${virtualizer.getTotalSize()}px` }}>
      {virtualRows.map((virtualRow) => {
        // Get the array of items for the current row
        const rowItems = gridItems[virtualRow.index];
        
        return (
          <VirtualRowWrapper
            key={virtualRow.key}
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <GridRow columnCount={columnCount}>
              {/* Map over the items in this specific row to render the cards */}
              {rowItems.map(item => (
                <MediaCard key={item.id} media={item} onEditClick={onEditClick} />
              ))}
            </GridRow>
          </VirtualRowWrapper>
        );
      })}
      
      <div style={{
          position: 'absolute',
          top: `${virtualizer.getTotalSize()}px`,
          width: '100%',
      }}>
        {isLoadingMore && <ListFooter><Spinner size={32} /></ListFooter>}
        {!hasMore && <ListFooter>You've reached the end of the list.</ListFooter>}
      </div>
    </ListContainer>
  );
};

export default MediaList;