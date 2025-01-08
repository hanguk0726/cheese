import React, { useState, useEffect, cache } from 'react';
import appStore from '@/data/store/app';
import videoStore from '@/data/store/video';
import SearchBarView from '../layout/SearchBar';


const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const searchVideos = cache(async (_keyword: string) => {
    try {
      appStore.setLoading(true);
      const response = await fetch(`/api/videos?keyword=${encodeURIComponent(_keyword)}`);
      if (!response.ok) throw new Error('API 요청 실패');
      const data = await response.json();
      videoStore.saveVideos(_keyword, data.videos)

      const newSearches = [_keyword, ...recentSearches.filter(k => k !== _keyword)].slice(0, 5);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('비디오 검색 중 오류:', error);
    } finally {
      appStore.setLoading(false);
    }
  });


  const handleSearch = () => {
    if (!keyword || keyword.trim() === '') return;
    searchVideos(keyword);

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
    searchVideos(searchTerm);
  };

  const handleDeleteRecentSearch = (searchTerm: string) => {
    const updatedSearches = recentSearches.filter(search => search !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <SearchBarView
      keyword={keyword}
      setKeyword={setKeyword}
      placeholder={placeholder}
      handleSearch={handleSearch}
      handleKeyDown={handleKeyDown}
      handleRecentSearchClick={handleRecentSearchClick}
      handleDeleteRecentSearch={handleDeleteRecentSearch}
      recentSearches={recentSearches}
    />
  );
};

export default SearchBar;