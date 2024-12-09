/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useMemo, useRef } from 'react';

// 비디오 타입 정의
interface Video {
    videoNo: number;
    publishDate: string;
    duration: number;
    readCount: number;
    videoCategory: string;
}

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
`;

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Heatmap = ({ data }: { data: Video[] }) => {
    const [mappingField, setMappingField] = useState<'duration' | 'readCount'>('duration');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [hoveredDayData, setHoveredDayData] = useState<{
        date: string, 
        videos: Video[], 
        totalDuration: number, 
        totalReadCount: number
    } | null>(null);

    // 강도 계산 함수 
    const calculateIntensity = (value: number, isDuration: boolean) => {
        if (isDuration) {
            if (value >= 7200) return 4; // 2시간 이상
            if (value >= 3600) return 3; // 1~2시간
            if (value >= 1800) return 2; // 30분~1시간
            if (value > 0) return 1; // 30분 미만
        } else {
            if (value >= 10000) return 4; // 10000회 이상
            if (value >= 5000) return 3; // 5000~10000회
            if (value >= 1000) return 2; // 1000~5000회
            if (value > 0) return 1; // 1000회 미만
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
        const result = [];
        for (let month = 0; month < 12; month++) {
            const firstDay = new Date(selectedYear, month, 1);
            const lastDay = new Date(selectedYear, month + 1, 0);
            const firstDayOfWeek = (firstDay.getDay() || 7) - 1;

            const days = Array(firstDayOfWeek).fill(null);
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

    return (
        <>
            <div css={{ marginBottom: '20px', textAlign: 'center' }}>
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

            <div css={heatmapStyles}>
                {monthsInYear.map(({ month, days }) => (
                    <div key={month}>
                        <h3>{months[month]}</h3>
                        <div className="month-container">
                            {weekdays.map((weekday) => (
                                <div key={weekday} className="weekday-label">{weekday}</div>
                            ))}
                            {days.map((dayData, index) => (
                                <div
                                    key={`${month}-${index}`}
                                    className={`day-cell ${dayData && dayData.hasData ? `${mappingField}-${dayData.intensity}` : 'empty'}`}
                                    css={dayData ? {} : { visibility: 'hidden' }}
                                    onMouseEnter={() => dayData?.hasData && handleMouseEnter(dayData.date)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {hoveredDayData?.date === dayData?.date && dayData?.hasData && (
                                        <div className="tooltip">
                                            <strong>Date:</strong> {dayData.date}<br />
                                            <strong>Categories:</strong> {hoveredDayData?.videos.map(v => v.videoCategory).join(', ')}<br />
                                            <strong>Total Duration:</strong> {Math.round((hoveredDayData?.totalDuration || 1) / 60)} mins<br />
                                            <strong>Total Read Count:</strong> {hoveredDayData?.totalReadCount.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Heatmap;