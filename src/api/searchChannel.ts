import { ManageVideoSearchOptions } from "chzzk/dist/api/manage";

const DEFAULT_MANAGE_VIDEO_SEARCH_OPTIONS = {
    page: 0,
    size: 50,
};

async function fetchAllVideos(channelId: string): Promise<any[]> {
    let options = DEFAULT_MANAGE_VIDEO_SEARCH_OPTIONS;

    let page = options.page;
    let allVideos: any[] = [];
    let hasMore = true;

    while (hasMore) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: options.size.toString(),
            videoType: ''
        });

        try {
            const response = await fetch(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/videos?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log(data.content.data);
            if (data && data.content && data.content.data.length > 0) {
                allVideos = [...allVideos, ...data.content.data]; // 데이터를 합침
                page++; // 다음 페이지로 이동
            } else {
                hasMore = false; // 더 이상 데이터가 없으면 종료
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            hasMore = false; // 에러 발생 시 종료
        }
    }

    return allVideos; // 모든 비디오 정보 반환
}

export default fetchAllVideos