import { Video } from '@/model/Video';
import { ChzzkClient } from 'chzzk';
import { NextApiRequest, NextApiResponse } from 'next';
import fetchData from './util';

const client = new ChzzkClient(); // API 클라이언트 초기화

const DEFAULT_MANAGE_VIDEO_SEARCH_OPTIONS = {
    page: 0,
    size: 50,
};

// 채널 아이디를 추출하는 함수
const getChannelId = async (keyword: string): Promise<string | null> => {
    try {
        const result = await client.search.channels(keyword);
        if (result.channels && result.channels.length > 0) {
            return result.channels[0].channelId;
        }
        return null;
    } catch (error) {
        console.error('채널 검색 중 오류:', error);
        throw new Error('채널 검색 중 오류 발생');
    }
};


// 채널의 비디오 리스트를 가져오는 함수
async function fetchAllVideos(channelId: string): Promise<Video[]> {
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
            const response = await fetchData(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/videos?${params.toString()}`, 'GET');

            const data = response;
            // console.log(data.content.data);
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

// Next.js API 핸들러
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
        res.status(400).json({ error: '검색어(keyword)가 필요합니다.' });
        return;
    }

    try {
        // 채널 ID 가져오기
        const channelId = await getChannelId(keyword);
        if (!channelId) {
            res.status(404).json({ error: '채널을 찾을 수 없습니다.' });
            return;
        }

        // 비디오 리스트 가져오기
        const videos = await fetchAllVideos(channelId);
        res.status(200).json({ videos });
    } catch (error) {
        console.error('API 처리 중 오류:', error);
        res.status(500).json({ error: 'API 처리 중 오류가 발생했습니다.' });
    }
}
