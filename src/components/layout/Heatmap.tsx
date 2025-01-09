/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewIcon from '@mui/icons-material/GridView';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { MonthData } from '@/model/time';
import { HeatmapViewProps } from '@/model/heatmap';
import styled from '@emotion/styled';


const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Wrapper = styled.div`
    width: calc(100vw - 40px);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
`;

// 스타일 정의 
const heatmapStyles = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .month-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .weekday-label {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
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
    margin-top: 20px;
  }

  .navigation-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
  }
`;

const HeatmapView: React.FC<HeatmapViewProps> = ({
    viewMode,
    mappingField,
    monthsInYear,
    dailyData,
    calendarDate,
    setCalendarDate,
    setMappingField,
    yearBounds,
    handleNextMonth,
    handlePrevMonth,
    handleMouseEnter,
    handleMouseLeave,
    toggleViewMode,
    hoveredDayData,
}) => {

    // 월 렌더링
    const renderMonths = () => {
        if (viewMode === 'slide') {
            const monthData = monthsInYear.find(m => m.month === calendarDate.monthIndex);
            return monthData ? renderMonth(monthData, true) : null;
        } else {
            return (
                <div css={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(4, 1fr)',
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
                <h2 css={{ margin: '20px 0' }}>{months[monthData.month]}</h2>
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
        <Wrapper>
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
                            value={calendarDate.year}
                            onChange={(e) => setCalendarDate({
                                year: parseInt(e.target.value),
                                monthIndex: calendarDate.monthIndex
                            })}
                        >
                            {Array.from({ length: yearBounds.maxYear - yearBounds.minYear + 1 },
                                (_, index) => yearBounds.minYear + index).map((year) => (
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
        </Wrapper>
    );
};

export default HeatmapView;