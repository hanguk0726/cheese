/** @jsxImportSource @emotion/react */
import { useState, useMemo, useEffect } from 'react';
import { Video } from '@/model/video';
import { CalendarDate, MonthData } from '@/model/time';
import HeatmapView from '../layout/Heatmap';
import { observer } from 'mobx-react';
import videoStore from '@/data/store/video';
import snackbarStore from '@/data/store/snackbar';
import { SnackbarSeverity } from '@/model/app';


const Heatmap = () => {
    const videos = videoStore.videos;
    // videos.map(video => console.log(JSON.stringify(video)));
    const [mappingField, setMappingField] = useState<'duration' | 'readCount'>('duration');
    const [shouldSnackbar, setShouldSnackbar] = useState(false);
    const [warningType, setWarningType] = useState<'noPrev' | 'noNext'>('noPrev');
    const [calendarDate, setCalendarDate] = useState<CalendarDate>
        ({ year: new Date().getFullYear(), monthIndex: new Date().getMonth() });
    const [minYear, setMinYear] = useState<number>(Infinity);
    const [maxYear, setMaxYear] = useState<number>(-Infinity);
    const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
    const [hoveredDayData, setHoveredDayData] = useState<{
        date: string,
        videos: Video[],
        totalDuration: number,
        totalReadCount: number
    } | null>(null);

    // 최솟년, 최댓년 계산
    useEffect(() => {
        let localMinYear = Infinity;  // 최소 연도 초기값
        let localMaxYear = -Infinity; // 최대 연도 초기값

        const dates = videos.map(video => video.publishDate.split(' ')[0]);

        dates.forEach((date) => {
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
    }, [videos]);

    useEffect(() => {
        if (shouldSnackbar) {
            setShouldSnackbar(false);
            if (warningType === 'noPrev') {
                snackbarStore.showSnackbar('이전 기록이 없습니다.', SnackbarSeverity.Info);
            } else if (warningType === 'noNext') {
                snackbarStore.showSnackbar('다음 기록이 없습니다.', SnackbarSeverity.Info);
            }
        }
    }, [shouldSnackbar]);

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


    // 월별 데이터 생성
    const monthsInYear = useMemo(() => {
        const result: MonthData[] = [];
        for (let month = 0; month < 12; month++) {
            const firstDay = new Date(calendarDate.year, month, 1);
            const lastDay = new Date(calendarDate.year, month + 1, 0);
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
    }, [dailyData, calendarDate.year, mappingField]);

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
        setCalendarDate((prev) => {

            const newMonthIndex = (prev.monthIndex + 1) % 12;

            // 1월로 넘어갈 때 (newMonthIndex === 0)
            if (newMonthIndex === 0) {
                if (prev.year < maxYear) {
                    const newYear = prev.year + 1;
                    return { year: newYear, monthIndex: newMonthIndex };
                } else {
                    setWarningType('noNext');
                    setShouldSnackbar(true);
                    return prev; // maxYear에서 더 이상 이동하지 않음
                }
            }

            return { year: prev.year, monthIndex: newMonthIndex };
        });
    };

    const handlePrevMonth = () => {
        setCalendarDate((prev) => {
            const newMonthIndex = (prev.monthIndex - 1 + 12) % 12;

            // 12월로 넘어갈 때 (newMonthIndex === 11)
            if (newMonthIndex === 11) {
                if (prev.year > minYear) {
                    const newYear = prev.year - 1;
                    return { year: newYear, monthIndex: newMonthIndex };
                } else {
                    setWarningType('noPrev');
                    setShouldSnackbar(true);
                    return prev; // minYear에서 더 이상 이동하지 않음
                }
            }

            return { year: prev.year, monthIndex: newMonthIndex };
        });

    };

    // 보기 모드 토글
    const toggleViewMode = () => {
        setViewMode(prev => prev === 'slide' ? 'grid' : 'slide');
    };

    if (!videos || videos.length === 0) return <span></span>;//empty

    return (
        <HeatmapView
            viewMode={viewMode}
            mappingField={mappingField}
            monthsInYear={monthsInYear}
            dailyData={dailyData}
            setMappingField={setMappingField}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
            yearBounds={{ minYear, maxYear }}
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