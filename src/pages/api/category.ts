//https://api.chzzk.naver.com/service/v1/categories/GAME/{{category}}/info

import { CATEGORY_EMPTY, CategoryInfo, CategoryStatistics } from "@/model/Category";
import { Video } from "@/model/Video";
import fetchData from "./util";
import { NextApiRequest, NextApiResponse } from "next";

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

async function getCategoryInfo(videos: Video[]): Promise<CategoryInfo[]> {

    const list: CategoryInfo[] = [];
    for (const video of videos) {
        if (video.categoryType === null || video.videoCategory === null) {
            console.log('null categoryType || videoCategory');
            list.push({
                content: {
                    categoryId: video.videoCategory,
                    posterImageUrl: CATEGORY_EMPTY.posterImageUrl,
                    categoryValue: CATEGORY_EMPTY.categoryValue,
                },
            });
            continue;
        };
        
        if (video.posterImageUrl.length !== 0) {
            list.push({
                content: {
                    categoryId: video.videoCategory,
                    posterImageUrl: video.posterImageUrl,
                    categoryValue: video.videoCategoryValue,
                },
            });
            continue;
        };

        console.log('fetching new category info');
        const response = await fetchData(`https://api.chzzk.naver.com/service/v1/categories/${video.categoryType}/${video.videoCategory}/info`, 'GET');
        const data: CategoryInfo = response;

        list.push(data);
    }
    return list;
}

// 사용 예시:
// getCategoryImagePairs(['League_of_Legends', 'Dota_2']).then(console.log).catch(console.error);




async function calculateCategoryStatistics(
    videos: Video[],
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
    console.log(`Fetching category info for ${categories}`);
    const categoryInfoList = await getCategoryInfo(videos);

    // 3. 카테고리 데이터 매핑
    const categoryInfoMap = categoryInfoList.reduce((acc, info) => {
        acc[info.content.categoryId] = info
        return acc;
    }, {} as Record<string, CategoryInfo>);

    // 4. 통계 계산 및 이미지 추가
    return Object.entries(categoryGroups).map(([categoryKey, categoryVideos]) => {
        const totalVideos = categoryVideos.length;
        const totalDuration = categoryVideos.reduce((sum, video) => sum + video.duration, 0);
        const averageDuration = totalDuration / totalVideos;
        const totalLivePv = categoryVideos.reduce((sum, video) => sum + video.livePv, 0);
        const averageLivePv = totalLivePv / totalVideos;
        console.log(`Processing category: ${categoryKey}`);
        return {
            categoryName: categoryKey,
            categoryValue: categoryInfoMap[categoryKey].content.categoryValue,
            posterImageUrl: categoryInfoMap[categoryKey].content.posterImageUrl, // 이미지 URL 추가
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


// Next.js API 핸들러
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
            return;
        }

        // 요청 본문에서 videos 데이터 추출
        const { videos } = req.body;

        if (!videos || !Array.isArray(videos)) {
            res.status(400).json({ error: 'Invalid input: "videos" must be an array.' });
            return;
        }

        // 카테고리 통계 계산
        const data = await calculateCategoryStatistics(videos);

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
}