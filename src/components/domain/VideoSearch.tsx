import React, { cache, Suspense, use, useEffect, useRef, useState } from 'react';
import { BaseVideo } from 'chzzk';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Spacer from '../util/Spacer';
import Heatmap from './Heatmap';
import { useSearchParams } from 'next/navigation';
import VideoChart from './VideoChart';

const SearchWrapper = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 0 10px;
  font-size: 24px; // 글자 크기 키우기
  width: 400px; // 입력 필드 너비 늘리기
  height: 60px; // 높이 키우기
  border: none; // 기본 보더를 없앱니다.
  border-bottom: 2px solid #ccc; // 바텀 보더만 활성화
  text-align: center; /* 글자 가운데 정렬 */
  &:focus {
    outline: none;
  }
  &::placeholder {
    text-align: center; /* placeholder도 가로 중앙 정렬 */
    color: #aaa; /* placeholder 색상 설정 */
  }
  spellcheck: false;
`;


const SearchButton = styled(IconButton)`
  padding: 8px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const VideoSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [videos, setVideos] = useState<BaseVideo[]>([]);

    const searchParams = useSearchParams()

    useEffect(() => {
        const queryKeyword = searchParams.get('keyword');
        if (queryKeyword) {
            setKeyword(queryKeyword);
            if (videos.length === 0) searchVideos();
        }
    }, [searchParams]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchVideos();
        }
    };

    const searchVideos = cache(async () => {
        try {
            if (!keyword) return;
            const response = await fetch(`/api/videos?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            setVideos(data.videos);
        } catch (error) {
            console.error('비디오 검색 중 오류:', error);
        }
    });



    return (
        <SearchWrapper>
            <div>
                <Spacer size={51} axis="horizontal" />
                <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="치지직 스트리머 이름을 입력해보세요."
                    onKeyDown={handleKeyDown}
                />
                <SearchButton onClick={searchVideos}>
                    <SearchIcon fontSize="large" />
                </SearchButton>
            </div>

            {/* Display chart only if there are videos */}
            {videos.length > 0 && (
                <div>
                    <VideoChart videos={videos} />

                    {/* <Heatmap data={videos} /> */}
                </div>
            )}
        </SearchWrapper>
    );
};

export default VideoSearch;
