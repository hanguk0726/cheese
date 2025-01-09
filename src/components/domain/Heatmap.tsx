/** @jsxImportSource @emotion/react */
import { useState, useMemo, useEffect } from 'react';
import { Video } from '@/model/video';
import { MonthData } from '@/model/time';
import HeatmapView from '../layout/Heatmap';
import { observer } from 'mobx-react';
import videoStore from '@/data/store/video';


const Heatmap = () => {
    const videos = videoStore.videos;
    // videos.map(video => console.log(JSON.stringify(video)));
    const [mappingField, setMappingField] = useState<'duration' | 'readCount'>('duration');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
    const [minYear, setMinYear] = useState<number>(Infinity);
    const [maxYear, setMaxYear] = useState<number>(-Infinity);
    const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
    const [hoveredDayData, setHoveredDayData] = useState<{
        date: string,
        videos: Video[],
        totalDuration: number,
        totalReadCount: number
    } | null>(null);

    // 강도 계산 함수
    const calculateIntensity = (value: number, isDuration: boolean) => {
        if (isDuration) {
            if (value >= 7200) return 4;
            if (value >= 3600) return 3;
            if (value >= 1800) return 2;
            if (value > 0) return 1;
        } else {
            if (value >= 10000) return 4;
            if (value >= 5000) return 3;
            if (value >= 1000) return 2;
            if (value > 0) return 1;
        }
        return 0;
    };

    // 날짜별 데이터 집계
    const dailyData = useMemo(() => {
        const map: Record<string, {
            videos: Video[],
            totalDuration: number,
            totalReadCount: number
        }> = {};

        videos.forEach((video) => {
            const date = video.publishDate.split(' ')[0];

            if (!map[date]) {
                map[date] = { videos: [], totalDuration: 0, totalReadCount: 0 };
            }

            map[date].videos.push(video);
            map[date].totalDuration += video.duration;
            map[date].totalReadCount += video.readCount;
        });

        return map;
    }, [videos]);

    // 최솟년, 최댓년 계산
    useEffect(() => {
        let localMinYear = Infinity;  // 최소 연도 초기값
        let localMaxYear = -Infinity; // 최대 연도 초기값

        Object.keys(dailyData).forEach((date) => {
            const year = Number(date.split('-')[0]);

            if (year < localMinYear) {
                localMinYear = year;
            }
            if (year > localMaxYear) {
                localMaxYear = year;
            }
        });

        // 최소/최대 연도를 상태에 저장
        setMinYear(localMinYear);
        setMaxYear(localMaxYear);
    }, [dailyData]);  // dailyData가 변경될 때마다 실행

    // 월별 데이터 생성
    const monthsInYear = useMemo(() => {
        const result: MonthData[] = [];
        for (let month = 0; month < 12; month++) {
            const firstDay = new Date(selectedYear, month, 1);
            const lastDay = new Date(selectedYear, month + 1, 0);
            const firstDayOfWeek = (firstDay.getDay() || 7) - 1;

            const days: any[] = Array(firstDayOfWeek).fill(null);
            for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
                const dateString = day.toISOString().split('T')[0];
                const dayData = dailyData[dateString];
                const intensity = dayData
                    ? calculateIntensity(
                        mappingField === 'duration'
                            ? dayData.totalDuration
                            : dayData.totalReadCount,
                        mappingField === 'duration'
                    )
                    : 0;

                days.push({
                    date: dateString,
                    intensity,
                    hasData: !!dayData
                });
            }

            result.push({ month, days });
        }
        return result;
    }, [dailyData, selectedYear, mappingField]);

    // 마우스 이벤트 핸들러
    const handleMouseEnter = (date: string) => {
        const dayData = dailyData[date];
        if (dayData) {
            setHoveredDayData({
                date,
                ...dayData
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredDayData(null);
    };

    // 월 네비게이션 핸들러
    const handleNextMonth = () => {
        setCurrentMonthIndex((prev) => (prev + 1) % 12);
    };

    const handlePrevMonth = () => {
        setCurrentMonthIndex((prev) => (prev - 1 + 12) % 12);
    };

    // 보기 모드 토글
    const toggleViewMode = () => {
        setViewMode(prev => prev === 'slide' ? 'grid' : 'slide');
    };

    if (!videos || videos.length === 0) return <span></span>;//empty

    return (
        <HeatmapView
            viewMode={viewMode}
            currentMonthIndex={currentMonthIndex}
            mappingField={mappingField}
            monthsInYear={monthsInYear}
            dailyData={dailyData}
            setMappingField={setMappingField}
            yearBounds={{ minYear, maxYear }}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            handleNextMonth={handleNextMonth}
            handlePrevMonth={handlePrevMonth}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            toggleViewMode={toggleViewMode}
            hoveredDayData={hoveredDayData}
        />
    );
};

export default observer(Heatmap);