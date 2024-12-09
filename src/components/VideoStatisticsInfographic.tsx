import React, { useEffect, useRef, useState } from 'react';
import { BaseVideo } from 'chzzk';
import Chart from 'chart.js/auto';
import styled from '@emotion/styled';

const SearchWrapper = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ChartWrapper = styled.div`
  margin-top: 30px;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
`;

const VideoStatisticsInfographic = () => {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<BaseVideo[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

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
          placeholder="검색어를 입력하세요"
        />
        <Button onClick={searchVideos}>검색</Button>
      </div>

      <ul>
        {videos.map((video) => (
          <li key={video.videoId}>{video.videoTitle}</li>
        ))}
      </ul>

      {/* Display chart only if there are videos */}
      {videos.length > 0 && (
        <ChartWrapper>
          <canvas ref={chartRef} />
        </ChartWrapper>
      )}
    </SearchWrapper>
  );
};

export default VideoStatisticsInfographic;
