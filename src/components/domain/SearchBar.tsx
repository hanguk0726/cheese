import React, { useState, useEffect, cache } from 'react';
import appStore from '@/data/store/app';
import videoStore from '@/data/store/video';
import SearchBarView from '../layout/SearchBar';
import { observer } from 'mobx-react';
import snackbarStore from '@/data/store/snackbar';
import { SnackbarSeverity } from '@/model/app';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

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

  const dynamicPlaceholder = windowWidth <= 768
    ? "스트리머 검색"
    : "치지직 스트리머 이름을 입력해보세요.";

  const searchVideos = cache(async (_keyword: string) => {
    try {
      appStore.setLoading(true);
      const response = await fetch(`/api/videos?keyword=${encodeURIComponent(_keyword)}`);
      if (!response.ok) throw new Error('API 요청 실패');
      const data = await response.json();
      videoStore.saveVideos(data.videos)

      const newSearches = [_keyword, ...recentSearches.filter(k => k !== _keyword)].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      snackbarStore.showSnackbar('검색 결과가 없습니다.', SnackbarSeverity.Info);
      // console.error('비디오 검색 중 오류:', error);
    } finally {
      appStore.setLoading(false);
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchVideos(keyword);
    }
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setKeyword(searchTerm);
    searchVideos(searchTerm);
  };

  const handleDeleteRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm).slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <SearchBarView
      keyword={keyword}
      setKeyword={setKeyword}
      placeholder={dynamicPlaceholder}
      handleSearch={searchVideos}
      handleKeyDown={handleKeyDown}
      handleRecentSearchClick={handleRecentSearchClick}
      handleDeleteRecentSearch={handleDeleteRecentSearch}
      recentSearches={recentSearches}
    />
  );
};

export default observer(SearchBar);