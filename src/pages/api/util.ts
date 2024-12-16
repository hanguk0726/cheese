async function fetchData(apiUrl: string, method: string) {
    try {
        const response = await fetch(apiUrl, {
            method: method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.log(response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// 사용 예시
// const data = await fetchData('https://api.chzzk.naver.com/service/v1/channels/123/videos', 'GET');

export default fetchData;