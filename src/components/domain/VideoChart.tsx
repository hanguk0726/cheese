/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useRef, useEffect } from 'react';
import { Chart, ChartData, ChartOptions, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';

// Chart.js 모듈 등록
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
);


// 초를 'HH:MM' 형식으로 변환하는 함수
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
};
// 'yyyy-mm-dd HH:MM:SS' 형식의 날짜를 'yyyy-mm-dd'로 변환하는 함수
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface Video {
    videoTitle: string;
    readCount: number;
    duration: number;
    publishDate: string;
}

interface ChartComponentProps {
    videos: Video[];
}

const VideoChart: React.FC<ChartComponentProps> = ({ videos }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    const chartData: ChartData<'line', number[], string> = {
        labels: videos.map((video) => video.videoTitle),
        datasets: [
            {
                label: '조회수',
                data: videos.map((video) => video.readCount),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointRadius: 3,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone', // 올바른 타입으로 수정
            },
            {
                label: '영상 길이 (시간:분)',
                data: videos.map((video) => video.duration),
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointRadius: 3,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // position 값을 올바른 값으로 수정
                labels: {
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                callbacks: {
                    // 툴팁이 나타날 때 '영상 길이 (초)' 값 변환
                    label: (tooltipItem) => {
                        const video = videos[tooltipItem.dataIndex];
                        const result: string[] = [];

                        // 날짜, 제목, 조회수, 영상 길이 (초)를 각 줄로 분리
                        const formattedDate = formatDate(video.publishDate);
                        const formattedDuration = formatDuration(tooltipItem.raw as number);

                        result.push(formattedDate); // 날짜
                        result.push(`${tooltipItem.dataset.label}: ${tooltipItem.raw}`); // 조회수

                        if (tooltipItem.datasetIndex === 1) {
                            //기존 데이터 버리고 포맷팅으로 출력
                            result.pop();
                            result.push(`영상 길이(시간, 분): ${formattedDuration}`); // 영상 길이 (초)
                        }

                        return result; // 여러 줄로 된 배열 반환
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#333',
                },
            },
            y: {
                ticks: {
                    color: '#333',
                },
                grid: {
                    color: 'rgba(0,0,0,0.1)',
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 3,
            },
        },
    };

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        if (chartRef.current && videos.length > 0) {
            chartInstanceRef.current = new Chart(chartRef.current, {
                type: 'line',
                data: chartData,
                options,
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [videos]);

    return (
        <div>
            <canvas
                ref={chartRef}
                css={css`
          width: 100%;
          height: 500px;
          max-width: 1000px;
        `}
            />
        </div>
    );
};

export default VideoChart;
