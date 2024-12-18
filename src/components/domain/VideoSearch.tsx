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
        try {
            const response = await fetch(`/api/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videos }),
            });
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
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
