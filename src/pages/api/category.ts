//https://api.chzzk.naver.com/service/v1/categories/GAME/{{category}}/info

import { CategoryInfo, CategoryStatistics } from "@/model/Category";
import { Video } from "@/model/Video";

// {
//     "code": 200,
//     "message": null,
//     "content": {
//         "categoryType": "GAME",
//         "categoryId": "League_of_Legends",
//         "categoryValue": "리그 오브 레전드",
//         "posterImageUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMTFfMjI5/MDAxNzAyMjU5Njk2ODQ5.bQMe6kUHvW9G6o4HkLkMXVZNJTuzRDv6wt9LIXJibP0g.fDL9ksaxRv6H-8WlnhZPRKi7uIz5yRfPAJWDF9_Z9YUg.JPEG/2.%EB%A6%AC%EA%B7%B8%EC%98%A4%EB%B8%8C%EB%A0%88%EC%A0%84%EB%93%9C_%EC%99%84%EC%84%B1%EB%B3%B8_%EC%9D%B4%EC%9D%80%EC%A0%95.jpg",
//         "openLiveCount": 134,
//         "concurrentUserCount": 3549,
//         "tags": [
//             "라이엇 게임즈",
//             "리그오브레전드",
//             "e스포츠",
//             "전략",
//             "AOS",
//             "MOBA"
//         ],
//         "existLounge": true,
//         "following": false,
//         "newCategory": false,
//         "dropsCampaignList": []
//     }
// }

async function getCategoryInfo(categories: string[]): Promise<CategoryInfo[]> {

    const list: CategoryInfo[] = [];
    for (const category of categories) {
        const response = await fetch(`https://api.chzzk.naver.com/service/v1/categories/GAME/${category}/info`);
        if (!response.ok) {
            console.error(`Failed to fetch category info for ${category}`);
            continue;
        }

        const data: CategoryInfo = await response.json();

        list.push(data);
    }

    return list;
}

// 사용 예시:
// getCategoryImagePairs(['League_of_Legends', 'Dota_2']).then(console.log).catch(console.error);




async function calculateCategoryStatistics(
    videos: Video[], 
    getCategoryInfo: (categories: string[]) => Promise<CategoryInfo[]>
): Promise<CategoryStatistics[]> {
    // 1. 카테고리별 그룹화
    const categoryGroups = videos.reduce((acc, video) => {
        const key = video.videoCategory;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(video);
        return acc;
    }, {} as Record<string, Video[]>);

    // 2. 카테고리 이미지 한 번에 가져오기
    const categories = Object.keys(categoryGroups);
    const categoryInfoList = await getCategoryInfo(categories);
    
    // 3. 카테고리 이미지 매핑
    const categoryImageMap = categoryInfoList.reduce((acc, info) => {
        acc[info.content.categoryId] = info.content.posterImageUrl;
        return acc;
    }, {} as Record<string, string>);

    // 4. 통계 계산 및 이미지 추가
    return Object.entries(categoryGroups).map(([categoryKey, categoryVideos]) => {
        const totalVideos = categoryVideos.length;
        const totalDuration = categoryVideos.reduce((sum, video) => sum + video.duration, 0);
        const averageDuration = totalDuration / totalVideos;
        const totalLivePv = categoryVideos.reduce((sum, video) => sum + video.livePv, 0);
        const averageLivePv = totalLivePv / totalVideos;

        return {
            categoryName: categoryKey,
            categoryValue: categoryVideos[0].videoCategoryValue,
            posterImageUrl: categoryImageMap[categoryKey], // 이미지 URL 추가
            totalVideos,
            totalDuration,
            averageDuration,
            totalLivePv,
            averageLivePv
        };
    }).sort((a, b) => b.totalLivePv - a.totalLivePv);
}

// 사용 예시
// const videoList = [/* 여기에 비디오 배열 */];
// const categoryStats = calculateCategoryStatistics(videoList);
// console.log(categoryStats);


export default { getCategoryInfo, calculateCategoryStatistics }
