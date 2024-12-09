import { ChzzkClient } from "chzzk";

const getChannelId = async (client: ChzzkClient, keyword: string): Promise<string | null> => {
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