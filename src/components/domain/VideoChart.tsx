/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react';
import { Chart, ChartData, ChartOptions, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { formatDate, formatDuration } from '../util/formatTime';
import videoStore from '@/data/store/video';
import { observer } from 'mobx-react';

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


const VideoChart = () => {
    const videos = videoStore.videos;
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
                pointRadius: 4,
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
                pointRadius: 4,
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            },
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: {
                        size: 14,
                    },
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
                    autoSkip: true,
                    maxTicksLimit: 20,
                    callback: function (this: any, value: string | number, index: number, ticks: any[]): string {
                        const characterLimit = 8;
                        const label = this.getLabelForValue(value); // 라벨 값을 가져옴

                        if (label.length >= characterLimit) {
                            // 라벨이 characterLimit 이상이면 자르고 '...' 추가
                            return label.slice(0, characterLimit - 1).trim() + '...';
                        }

                        return label; // 길이가 넘지 않으면 그대로 반환
                    }
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
        const destroyChart = () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null; // Make sure to nullify the chart instance after destroying it
            }
        };
        const loadChartWithZoom = async () => {
            if (chartRef.current && videos.length > 0) {
                if (typeof window !== 'undefined') {
                    // 동적 임포트
                    const { default: zoomPlugin } = await import('chartjs-plugin-zoom');

                    // 기존 등록된 차트 모듈에 줌 플러그인 추가
                    Chart.register(zoomPlugin);
                    destroyChart();
                    chartInstanceRef.current = new Chart(chartRef.current, {
                        type: 'line',
                        data: chartData,
                        options,
                    });
                }
            }
        }

        loadChartWithZoom();

        return () => {
            destroyChart();
        };
    }, [videos]);

    if (!videos || videos.length === 0) return <span></span>;//empty

    return (
        <div
            style={{
                position: 'relative', // 부모 div의 크기가 바뀔 때 차트가 자동으로 조정되도록 함
                width: '1000px', // 부모 div의 너비는 100%로 설정
                height: '500px', // 부모 div의 높이를 고정 또는 동적으로 설정
            }}
        >
            <canvas
                ref={chartRef}
            />
        </div>
    );
};

export default observer(VideoChart);
