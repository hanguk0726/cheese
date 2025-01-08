import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


const Input = styled.input`
  padding: 10px 60px;
  margin: 0 10px;
  font-size: 24px;
  width: 500px;
  height: 60px;
  border: none;
  border-bottom: 2px solid #ccc;
  text-align: center;
  &:focus {
    outline: none;
    border-bottom: 2px solid #007bff;
    transition: border-color 0.3s ease;
  }
  &::placeholder {
    text-align: center;
    color: #aaa;
    white-space: nowrap;
    overflow: visible;
    text-overflow: clip; // 플레이스홀더 잘림 방지
  }
  spellcheck: false;
  @media (max-width: 768px) {
    width: 100%; 
    max-width: 100%;
    height: 50px;
    font-size: 20px;
    padding: 10px 50px;
    margin: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 15px;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const RecentSearches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start; // 왼쪽 정렬로 변경
  width: 100%;
  max-width: 100%;
  padding: 0 15px;
  margin-top: 15px;

  @media (max-width: 768px) {
    gap: 6px;
    padding: 0 10px;
    justify-content: flex-start; // 모바일에서도 왼쪽 정렬 유지
  }
`;


const RecentSearchItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 32px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const DeleteButton = styled(IconButton)`
  margin-left: 4px;
  padding: 2px;
  font-size: 12px;
`;

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
  initialKeyword?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  initialKeyword = '',
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const dynamicPlaceholder = windowWidth <= 768
    ? "스트리머 검색"
    : "치지직 스트리머 이름을 입력해보세요.";

  const handleSearch = () => {
    if (!keyword || keyword.trim() === '') return;
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

  const handleDeleteRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <SearchContainer>
      <SearchInputWrapper>
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={dynamicPlaceholder}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          spellCheck={false}
        />
        <div style={{ 
          position: 'absolute', 
          right: '10px',  
          display: 'flex', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton 
              onClick={handleSearch}
              sx={{
                padding: '10px',
                '@media (max-width: 768px)': {
                  padding: '12px'
                }
              }}
            >
              <SearchIcon />
            </IconButton>
          )}
        </div>
      </SearchInputWrapper>

      {recentSearches.length > 0 && (
        <RecentSearches>
          {recentSearches.map((search, index) => (
             <RecentSearchItem key={index}>
             <span onClick={() => handleRecentSearchClick(search)}>{search}</span>
             <DeleteButton
               onClick={() => handleDeleteRecentSearch(search)}
               size="small"
             >
               <CloseIcon fontSize="small" />
             </DeleteButton>
           </RecentSearchItem>
          ))}
        </RecentSearches>
      )}
    </SearchContainer>
  );
};

export default SearchBar;