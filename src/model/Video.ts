import { BaseVideo } from "chzzk";

export interface Video extends BaseVideo {
    livePv: number;
    posterImageUrl: string;
}

export interface SearchBarViewProps {
    keyword: string;
    setKeyword: (keyword: string) => void;
    placeholder: string;
    handleSearch: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleRecentSearchClick: (searchTerm: string) => void;
    handleDeleteRecentSearch: (searchTerm: string) => void;
    recentSearches: string[];
}