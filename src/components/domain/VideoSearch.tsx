import React, { cache, Suspense, use, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Spacer from '../util/Spacer';
import Heatmap from './Heatmap';
import { useSearchParams } from 'next/navigation';
import VideoChart from './VideoChart';
import { Video } from '@/model/Video';
import CategoryTable from './CategoryStatistics';
import { CategoryStatistics } from '@/model/Category';
import calculateCategoryStatistics from '@/pages/api/category';
import SearchBar from './SearchBar';
import { loadCache, saveCache } from '@/pages/util/cache';

const SearchWrapper = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1200px;
`;

const VideoSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [categoryStatistics, setCategoryStatistics] = useState<CategoryStatistics[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams()

    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    useEffect(() => {
        const queryKeyword = searchParams?.get('keyword');
        if (queryKeyword) {
            setKeyword(queryKeyword);
            if (videos.length === 0) searchVideos(queryKeyword);
        }
    }, [searchParams]);

    useEffect(() => {
        if (videos.length > 0) {
            getCategoryStatistics();
        }
    }, [videos]);

    const getCategoryStatistics = cache(async () => {
      const cachedMap = loadCache(); // 캐시 로드
      const categoryImageMap = cachedMap || {}; // 캐시가 없으면 빈 객체 사용

      // videos에 posterImageUrl 맵핑
      const updatedVideos = videos.map(video => ({
          ...video,
          posterImageUrl: categoryImageMap[video.videoCategory] || "", // 캐시에 값이 없으면 빈 문자열
      }));

      console.log("cache loaded");
      
        try {
            
            const response = await fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videos: updatedVideos }),
            });

            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            // categoryName과 posterImageUrl을 캐시에 업데이트
            const newCache = { ...categoryImageMap }; // 기존 캐시 복사
            data.forEach((category: { categoryName: string; posterImageUrl: string }) => {
                console.log(`categoryName ${category.categoryName} to posterImageUrl ${category.posterImageUrl}`);
                newCache[category.categoryName] = category.posterImageUrl; // 캐시 업데이트
            });

            saveCache(newCache); // 업데이트된 캐시 저장

            console.log("cache updated:", newCache);

            setCategoryStatistics(data);
        } catch (error) {
            console.error('카테고리 검색 중 오류:', error);
        }
    })



    const searchVideos = cache(async (_keyword: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/videos?keyword=${encodeURIComponent(_keyword)}`);
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            setVideos(data.videos);
            
            const newSearches = [_keyword, ...recentSearches.filter(k => k !== _keyword)].slice(0, 5);
            setRecentSearches(newSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        } catch (error) {
            console.error('비디오 검색 중 오류:', error);
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <SearchWrapper>

            <SearchBar            
                onSearch={searchVideos}
                isLoading={isLoading}
                initialKeyword={keyword}
            />
                
       
            {/* Display chart only if there are videos */}
            {videos.length > 0 && (
                <div>
                    {categoryStatistics.length > 0 &&
                        (<CategoryTable data={categoryStatistics} />)
                    }
                    {/* <VideoChart videos={videos} /> */}

                    {/* <Heatmap data={videos} /> */}
                </div>
            )}
        </SearchWrapper>
    );
};

export default VideoSearch;
