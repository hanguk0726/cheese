export interface CategoryInfo {
    content: {
        categoryId: string;
        posterImageUrl: string;
        categoryValue: string;
    }
}


export interface CategoryStatistics {
    categoryName: string;
    categoryValue: string;
    posterImageUrl: string;
    totalVideos: number;
    totalDuration: number;
    averageDuration: number;
    totalLivePv: number;
    averageLivePv: number;
}

export interface CategoryColumn {
    name: keyof CategoryStatistics;  // 실제 데이터의 키와 일치하는 타입
    label: string;                    // 화면에 표시될 라벨
}


export interface CategoryStatisticsTableViewProps {
    searchQuery: string,
    onChangeSearchQuery: (query: string) => void,
    data: CategoryStatistics[],
    columns: CategoryColumn[],
    onClickColumn: (columnName: keyof CategoryStatistics) => void
}

export const CATEGORY_EMPTY = {
    categoryValue: '카테고리 없음',
    posterImageUrl: '/images/none.png',
};