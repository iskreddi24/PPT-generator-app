// src/components/media/SearchBar.jsx
import styled from '@emotion/styled';

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px; /* leave space for clear button */
  font-size: 1rem;
  color: #F9FAFB; /* Gray-50 */
  background-color: #374151; /* Gray-700 */
  border: 1px solid #4B5563; /* Gray-600 */
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.12s ease-in-out;

  &:focus {
    border-color: #3B82F6; /* Blue-500 */
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
  }
`;

const SearchBarWrapper = styled.div`
  padding: 0;
  width: 100%;
  position: relative;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9CA3AF;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #F9FAFB;
    background: rgba(255,255,255,0.03);
  }

  &:focus {
    outline: 2px solid rgba(59,130,246,0.3);
  }
`;

const VisuallyHidden = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <SearchBarWrapper>
      <VisuallyHidden htmlFor="media-search">Search media by code</VisuallyHidden>
      <SearchInput
        id="media-search"
        type="text"
        placeholder="Search by media code..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search media by code or location"
      />
      {searchQuery && (
        <ClearButton
          aria-label="Clear search"
          onClick={() => setSearchQuery('')}
          title="Clear"
        >
          ×
        </ClearButton>
      )}
    </SearchBarWrapper>
  );
};

export default SearchBar;