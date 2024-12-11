import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import styled from '@emotion/styled';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// 필요한 모듈을 등록
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,  // CategoryScale을 등록
    Title,
    Tooltip,
    Legend
);

const ChartWrapper = styled.div`
  margin-top: 30px;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
`;


interface Video {
    videoTitle: string;
    readCount: number;
    duration: number;
}

interface ChartComponentProps {
    videos: Video[];
}

const VideoChart: React.FC<ChartComponentProps> = ({ videos }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);  // 차트 인스턴스를 참조할 변수 추가

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
        // 이전 차트가 있다면 제거
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // 새로운 차트 생성
        if (chartRef.current && videos.length > 0) {
            chartInstanceRef.current = new Chart(chartRef.current, {
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

        // 컴포넌트가 언마운트될 때 차트 정리
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [videos]);

    return (
        <ChartWrapper>
            <div>
                <canvas
                    ref={chartRef}
                    css={css`
                    width: 100%;
                    height: 500px;  /* 원하는 높이 */
                    max-width: 1000px;  /* 최대 너비 */
                  `} />
            </div>
        </ChartWrapper>
    );
};

export default VideoChart;
