/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useMemo } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewIcon from '@mui/icons-material/GridView';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// 기존 타입 정의
interface Video {
    videoNo: number;
    publishDate: string;
    duration: number;
    readCount: number;
    videoCategory: string;
}

interface MonthData {
    month: number;
    days: {
        date: string;
        intensity: number;
        hasData: boolean;
    }[];
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// 스타일 정의 
const heatmapStyles = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  .month-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .weekday-label {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
    color: #555;
  }

  .day-cell {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #e0e0e0;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    position: relative;
    cursor: help;
  }

  .day-cell.readCount-1 { background-color: #ffe6e6; }
  .day-cell.readCount-2 { background-color: #ff9999; }
  .day-cell.readCount-3 { background-color: #ff4d4d; }
  .day-cell.readCount-4 { background-color: #b30000; }

  .day-cell.duration-1 { background-color: #e6f7ff; }
  .day-cell.duration-2 { background-color: #85d4ff; }
  .day-cell.duration-3 { background-color: #3399ff; }
  .day-cell.duration-4 { background-color: #003d99; }

  .tooltip {
    position: absolute;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    font-size: 0.8rem;
    pointer-events: none;
    transform: translate(-50%, -110%);
    left: 50%;
  }

  .month-wrapper {
    border: none;
    background: none;
  }

  .calendar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .navigation-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
  }
`;

const Heatmap = ({ data }: { data: Video[] }) => {
    const [mappingField, setMappingField] = useState<'duration' | 'readCount'>('duration');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
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
        
        data.forEach((video) => {
            const date = video.publishDate.split(' ')[0];
            
            if (!map[date]) {
                map[date] = { videos: [], totalDuration: 0, totalReadCount: 0 };
            }
            
            map[date].videos.push(video);
            map[date].totalDuration += video.duration;
            map[date].totalReadCount += video.readCount;
        });
        
        return map;
    }, [data]);

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

    // 월 렌더링
    const renderMonths = () => {
        if (viewMode === 'slide') {
            const monthData = monthsInYear.find(m => m.month === currentMonthIndex);
            return monthData ? renderMonth(monthData, true) : null;
        } else {
            return (
                <div css={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gridTemplateRows: 'repeat(3, 1fr)', 
                    gap: '15px' 
                }}>
                    {monthsInYear.slice(0, 12).map(monthData => renderMonth(monthData, false))}
                </div>
            );
        }
    };

    // 개별 월 렌더링
    const renderMonth = (monthData: MonthData, isSlideMode: boolean) => {
        return (
            <div 
                key={monthData.month} 
                css={{
                    border: 'none',
                    backgroundColor: 'transparent',
                }}
            >
                <h3>{months[monthData.month]}</h3>
                <div className="month-container">
                    {weekdays.map((weekday) => (
                        <div key={weekday} className="weekday-label">{weekday}</div>
                    ))}
                    {monthData.days.map((dayData, index) => (
                        <div
                            key={`${monthData.month}-${index}`}
                            className={`day-cell ${dayData && dayData.hasData ? `${mappingField}-${dayData.intensity}` : 'empty'}`}
                            css={dayData ? {} : { visibility: 'hidden' }}
                            onMouseEnter={() => dayData?.hasData && handleMouseEnter(dayData.date)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {hoveredDayData?.date === dayData?.date && dayData?.hasData && (
                                <div className="tooltip">
                                    <strong>Date:</strong> {dayData.date}<br />
                                    <strong>Categories:</strong> {dailyData[dayData.date]?.videos.map(v => v.videoCategory).join(', ')}<br />
                                    <strong>Total Duration:</strong> {Math.round((dailyData[dayData.date]?.totalDuration || 1) / 60)} mins<br />
                                    <strong>Total Read Count:</strong> {dailyData[dayData.date]?.totalReadCount.toLocaleString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 메인 렌더링
    return (
        <div css={heatmapStyles}>
            <div className="calendar-controls">
                <div>
                    <label htmlFor="mappingField" css={{ marginRight: '10px' }}>Map By:</label>
                    <select
                        id="mappingField"
                        value={mappingField}
                        onChange={(e) => setMappingField(e.target.value as 'duration' | 'readCount')}
                    >
                        <option value="duration">Duration</option>
                        <option value="readCount">Read Count</option>
                    </select>
                    
                    <label htmlFor="yearSelector" css={{ marginLeft: '20px', marginRight: '10px' }}>Year:</label>
                    <select
                        id="yearSelector"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {[2022, 2023, 2024].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <button 
                        className="navigation-button" 
                        onClick={toggleViewMode}
                        title={viewMode === 'slide' ? 'Switch to Grid View' : 'Switch to Slide View'}
                    >
                        {viewMode === 'slide' ? <GridViewIcon /> : <FullscreenIcon />}
                    </button>

                    {viewMode === 'slide' && (
                        <>
                            <button 
                                className="navigation-button" 
                                onClick={handlePrevMonth}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button 
                                className="navigation-button" 
                                onClick={handleNextMonth}
                            >
                                <ChevronRightIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {renderMonths()}
        </div>
    );
};

export default Heatmap;