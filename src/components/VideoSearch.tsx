import React, { useEffect, useRef, useState } from 'react';
import { BaseVideo } from 'chzzk';
import Chart from 'chart.js/auto';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Heatmap from './Heatmap';

const SearchWrapper = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
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

const ChartWrapper = styled.div`
  margin-top: 30px;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
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
    const chartRef = useRef<HTMLCanvasElement | null>(null);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchVideos();
        }
    };

    const searchVideos = async () => {
        try {
            const response = await fetch(`/api/videos?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            setVideos(data.videos);
        } catch (error) {
            console.error('비디오 검색 중 오류:', error);
        }
    };

    // Chart.js data configuration
    const chartData = {
        labels: videos.map((video) => video.videoTitle),
        datasets: [
            {
                label: '조회수',
                data: videos.map((video) => video.readCount),
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.4,
                fill: false,
            },
            {
                label: '영상 길이 (초)',
                data: videos.map((video) => video.duration),
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.4,
                fill: false,
            },
        ],
    };

    useEffect(() => {
        if (chartRef.current && videos.length > 0) {
            new Chart(chartRef.current, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }
    }, [videos]);

    return (
        <SearchWrapper>
            <div>
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

            {/* <ul>
                {videos.map((video) => (
                    <li key={video.videoId}>{video.videoTitle}</li>
                ))}
            </ul> */}

            {/* Display chart only if there are videos */}
            {videos.length > 0 && (
                <div>
                    {/* <ChartWrapper>
                        <canvas ref={chartRef} />
                    </ChartWrapper> */}


                    <Heatmap data={videos} />
                </div>
            )}
        </SearchWrapper>
    );
};

export default VideoSearch;
