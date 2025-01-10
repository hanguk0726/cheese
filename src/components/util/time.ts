
// 초를 'HH:MM' 형식으로 변환하는 함수
export const formatSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
};


// 분을 시간으로 변환하는 함수
export const formatMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60); // 전체 분을 시간으로 변환
    // const remainingMinutes = minutes % 60; // 남은 분 계산
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`; // 1자리 시간은 앞에 '0' 추가
    // const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`; // 1자리 분은 앞에 '0' 추가
    return formattedHours
};

// 'yyyy-mm-dd HH:MM:SS' 형식의 날짜를 'yyyy-mm-dd'로 변환하는 함수
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
