import { BaseVideo } from 'chzzk';
import React, { useState } from 'react';

const VideoSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [videos, setVideos] = useState<BaseVideo[]>([]);

    const searchVideos = async () => {
        try {
            const response = await fetch(`/api/videos?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            setVideos(data.videos);
        } catch (error) {
            console.error('비디오 검색 중 오류:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={searchVideos}>검색</button>
            <ul>
                {videos.map((video) => (
                    <li key={video.videoId}>{video.videoTitle}</li>
                ))}
            </ul>
        </div>
    );
};

export default VideoSearch;
