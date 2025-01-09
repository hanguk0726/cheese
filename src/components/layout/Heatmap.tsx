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
    overflow-x: auto;
    margin: 0 auto;
    -webkit-overflow-scrolling: touch;
`;

const HeatmapContainer = styled.div<{ isGrid: boolean }>`
    width:  ${({ isGrid }) => (isGrid ? '50vw' : '30vw')};
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const MonthContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
`;

const WeekdayLabel = styled.div`
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #555;
`;

const DayCell = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #e0e0e0;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    position: relative;
    cursor: help;

    &.readCount-1 { background-color: #ffe6e6; }
    &.readCount-2 { background-color: #ff9999; }
    &.readCount-3 { background-color: #ff4d4d; }
    &.readCount-4 { background-color: #b30000; }

    &.duration-1 { background-color: #e6f7ff; }
    &.duration-2 { background-color: #85d4ff; }
    &.duration-3 { background-color: #3399ff; }
    &.duration-4 { background-color: #003d99; }
`;

const Tooltip = styled.div`
    position: absolute;
    z-index: 10;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    font-size: 0.8rem;
    pointer-events: none;
    transform: translate(-50%, -110%);
    left: 50%;
`;

const CalendarControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

const NavigationButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
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
                <div
                    css={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(4, 1fr)',
                        gap: '15px',
                    }}
                >
                    {monthsInYear.slice(0, 12).map((monthData) => renderMonth(monthData, false))}
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
                <MonthContainer>
                    {weekdays.map((weekday) => (
                        <WeekdayLabel key={weekday}>{weekday}</WeekdayLabel>
                    ))}
                    {monthData.days.map((dayData, index) => (
                        <DayCell
                            key={`${monthData.month}-${index}`}
                            className={
                                dayData && dayData.hasData
                                    ? `${mappingField}-${dayData.intensity}`
                                    : 'empty'
                            }
                            css={dayData ? {} : { visibility: 'hidden' }}
                            onMouseEnter={() => dayData?.hasData && handleMouseEnter(dayData.date)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {hoveredDayData?.date === dayData?.date && dayData?.hasData && (
                                <Tooltip>
                                    <strong>Date:</strong> {dayData.date}
                                    <br />
                                    <strong>Categories:</strong>{' '}
                                    {dailyData[dayData.date]?.videos
                                        .map((v) => v.videoCategory)
                                        .join(', ')}
                                    <br />
                                    <strong>Total Duration:</strong>{' '}
                                    {Math.round((dailyData[dayData.date]?.totalDuration || 1) / 60)}{' '}
                                    mins
                                    <br />
                                    <strong>Total Read Count:</strong>{' '}
                                    {dailyData[dayData.date]?.totalReadCount.toLocaleString()}
                                </Tooltip>
                            )}
                        </DayCell>
                    ))}
                </MonthContainer>
            </div>
        );
    };

    // 메인 렌더링
    return (
        <Wrapper>
            <HeatmapContainer isGrid={viewMode === 'grid'}>
                <CalendarControls>
                    <div>
                        <label htmlFor="mappingField" css={{ marginRight: '10px' }}>
                            Map By:
                        </label>
                        <select
                            id="mappingField"
                            value={mappingField}
                            onChange={(e) =>
                                setMappingField(e.target.value as 'duration' | 'readCount')
                            }
                        >
                            <option value="duration">Duration</option>
                            <option value="readCount">Read Count</option>
                        </select>

                        <label
                            htmlFor="yearSelector"
                            css={{ marginLeft: '20px', marginRight: '10px' }}
                        >
                            Year:
                        </label>
                        <select
                            id="yearSelector"
                            value={calendarDate.year}
                            onChange={(e) =>
                                setCalendarDate({
                                    year: parseInt(e.target.value),
                                    monthIndex: calendarDate.monthIndex,
                                })
                            }
                        >
                            {Array.from(
                                {
                                    length:
                                        yearBounds.maxYear -
                                        yearBounds.minYear +
                                        1,
                                },
                                (_, index) =>
                                    yearBounds.minYear + index
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <NavigationButton
                            onClick={toggleViewMode}
                            title={
                                viewMode === 'slide'
                                    ? 'Switch to Grid View'
                                    : 'Switch to Slide View'
                            }
                        >
                            {viewMode === 'slide' ? (
                                <GridViewIcon />
                            ) : (
                                <FullscreenIcon />
                            )}
                        </NavigationButton>

                        {viewMode === 'slide' && (
                            <>
                                <NavigationButton onClick={handlePrevMonth}>
                                    <ChevronLeftIcon />
                                </NavigationButton>
                                <NavigationButton onClick={handleNextMonth}>
                                    <ChevronRightIcon />
                                </NavigationButton>
                            </>
                        )}
                    </div>
                </CalendarControls>

                {renderMonths()}
            </HeatmapContainer>
        </Wrapper>
    );
};

export default HeatmapView;
