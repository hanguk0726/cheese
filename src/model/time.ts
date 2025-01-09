export interface MonthData {
    month: number;
    days: {
        date: string;
        intensity: number;
        hasData: boolean;
    }[];
}

export interface CalendarDate {
    year: number;
    monthIndex: number;
}