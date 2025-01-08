import { Video } from '@/model/video';
import { makeAutoObservable } from 'mobx';

class VideoStore {
    videos:Video[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    saveVideos(videos: Video[]) {
        console.log(`Saving videos... length: ${videos.length}`);
        this.videos = videos;
    }

    clearVideosForQuery() {
        this.videos = [];
    }

}

const videoStore = new VideoStore();

export default videoStore;
