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