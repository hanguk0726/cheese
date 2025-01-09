import { CalendarDate, MonthData } from "./time";
import { Video } from "./video";

export interface HeatmapViewProps {
    viewMode: 'slide' | 'grid';
    mappingField: 'duration' | 'readCount';
    calendarDate: CalendarDate;
    setCalendarDate: (date: CalendarDate) => void;
    monthsInYear: MonthData[];
    dailyData: Record<string, { videos: Video[]; totalDuration: number; totalReadCount: number }>;
    setMappingField: (field: 'duration' | 'readCount') => void;
    yearBounds: {
        minYear: number,
        maxYear: number
    };
    handleNextMonth: () => void;
    handlePrevMonth: () => void;
    handleMouseEnter: (date: string) => void;
    handleMouseLeave: () => void;
    toggleViewMode: () => void;
    hoveredDayData: {
        date: string;
        videos: Video[];
        totalDuration: number;
        totalReadCount: number;
    } | null;
}