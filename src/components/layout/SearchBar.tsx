import styled from '@emotion/styled';
import { IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import appStore from '@/data/store/app';
import { SearchBarViewProps } from '@/model/video';



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
    border-bottom: 2px solid #ccc;
  }
  &::placeholder {
    text-align: center;
    color: #aaa;
    white-space: nowrap;
    overflow: visible;
    text-overflow: clip; // 플레이스홀더 잘림 방지
    transition: opacity 0.2s ease; /* opacity 애니메이션 추가 */
  }

  spellcheck: false;

  &:focus::placeholder {
    opacity: 0; /* 포커스 시 placeholder를 보이지 않게 함 */
  }

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

const SearchButtonWrapper = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  height: 100%;
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


const SearchBarView: React.FC<SearchBarViewProps> = ({ keyword, setKeyword, placeholder, handleSearch, handleKeyDown, handleRecentSearchClick, handleDeleteRecentSearch, recentSearches }) => {
  return (
    <SearchContainer>
      <SearchInputWrapper>
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          disabled={appStore.isLoading}
          spellCheck={false}
        />
        <SearchButtonWrapper>
          {appStore.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <SearchIcon onClick={handleSearch} sx={{ cursor: 'pointer', color: 'gray', fontSize: 28 }} />
          )}
        </SearchButtonWrapper>
      </SearchInputWrapper>

      {recentSearches.length > 0 && (
        <RecentSearches>
          {recentSearches.map((search) => (
            <RecentSearchItem key={search}>
              <span onClick={() => handleRecentSearchClick(search)}>{search}</span>
              <DeleteButton onClick={() => handleDeleteRecentSearch(search)} size="small">
                <CloseIcon fontSize="small" />
              </DeleteButton>
            </RecentSearchItem>
          ))}
        </RecentSearches>
      )}
    </SearchContainer>
  );
};

export default SearchBarView;