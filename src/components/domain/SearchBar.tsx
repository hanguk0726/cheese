import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { IconButton, CircularProgress, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    height: 60px;
    font-size: 24px;
    @media (max-width: 768px) {
      height: 40px;
      font-size: 16px;
    }
  }
  .MuiInputBase-input {
    text-align: center;me
  }
  width: 100%;
  max-width: 400px;
  margin: 0 10px;
  @media (max-width: 768px) {
    margin: 0 5px;
  }
`;

const RecentSearches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  max-width: 400px;
  width: 100%;
  padding: 0 10px;
  @media (max-width: 768px) {
    max-width: 100%;
    justify-content: center;
    gap: 6px;
  }
`;

const RecentSearchItem = styled.div`
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #e0e0e0;
  }
  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 12px;
  }
`;

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "치지직 스트리머 이름을 입력해보세요."
}) => {
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = () => {
    if (!keyword) return;
    onSearch(keyword);
    
    // Add to recent searches
    const newSearches = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setKeyword(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <StyledTextField
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div style={{ position: 'absolute', right: '20px' }}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          )}
        </div>
      </div>

      {recentSearches.length > 0 && (
        <RecentSearches>
          {recentSearches.map((search, index) => (
            <RecentSearchItem 
              key={index} 
              onClick={() => handleRecentSearchClick(search)}
            >
              {search}
            </RecentSearchItem>
          ))}
        </RecentSearches>
      )}
    </div>
  );
};

export default SearchBar;
