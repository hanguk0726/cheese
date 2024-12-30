import { BaseVideo } from "chzzk";

export interface Video extends BaseVideo {
    livePv: number;
    posterImageUrl: string;
}