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


export const CATEGORY_EMPTY = {
    categoryValue: '카테고리 없음',
    posterImageUrl: '/images/none.png',
};