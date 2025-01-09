import { MonthData } from "./time";
import { Video } from "./video";

export interface HeatmapViewProps {
    viewMode: 'slide' | 'grid';
    currentMonthIndex: number;
    mappingField: 'duration' | 'readCount';
    monthsInYear: MonthData[];
    dailyData: Record<string, { videos: Video[]; totalDuration: number; totalReadCount: number }>;
    setMappingField: (field: 'duration' | 'readCount') => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
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