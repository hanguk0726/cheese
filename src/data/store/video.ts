import { Video } from '@/model/video';
import { makeAutoObservable } from 'mobx';

class VideoStore {
    videos: Record<string, Video[]> = {};

    constructor() {
        makeAutoObservable(this);
    }

    saveVideos(query: string, videos: Video[]) {
        console.log(`Saving videos for query: ${query}, length: ${videos.length}`);
        this.videos[query] = videos;
    }

    clearVideosForQuery(query: string) {
        delete this.videos[query];
    }

}

const videoStore = new VideoStore();

export default videoStore;
