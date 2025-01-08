import { useState, useMemo, useEffect } from 'react';
import { CategoryColumn, CategoryStatistics } from '@/model/Category';
import CategoryStatisticsTableView from '../layout/CategoryStatistics';
import { loadCache, saveCache } from '@/pages/util/cache';
import { Video } from '@/model/Video';



const CategoryStatisticsTable = ({ videos }: { videos: Video[] }) => {
  const [data, setData] = useState<CategoryStatistics[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof CategoryStatistics>('totalLivePv');
  const [sortDirection, _] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchData = async () => {
      const categoryStatistics = await computeCategoryStatistics(videos);
      setData(categoryStatistics);
    };
    fetchData();
  }, [videos]);
  
  const filteredAndSortedData = useMemo(() => {
    if (!data) return []; 

    return data.filter(item =>
      item.categoryValue.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];
      if (columnA < columnB) return sortDirection === 'asc' ? -1 : 1;
      if (columnA > columnB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchQuery, sortColumn, sortDirection]);

  const columns: CategoryColumn[] = [
    { name: 'categoryName', label: 'Game' },
    { name: 'totalVideos', label: 'Total Videos' },
    { name: 'totalDuration', label: 'Total Duration' },
    { name: 'averageDuration', label: 'Avg Duration' },
    { name: 'totalLivePv', label: 'Total Live PV' },
    { name: 'averageLivePv', label: 'Avg Live PV' }
  ];

  return (
    <CategoryStatisticsTableView
      searchQuery={searchQuery}
      onChangeSearchQuery={setSearchQuery}
      data={filteredAndSortedData}
      columns={columns}
      onClickColumn={setSortColumn}
    />
  );

};


const computeCategoryStatistics = async (videos: Video[]) => {
  const cachedMap = loadCache(); // 캐시 로드
  const categoryImageMap = cachedMap || {}; // 캐시가 없으면 빈 객체 사용

  // videos에 posterImageUrl 맵핑
  const updatedVideos = videos.map(video => ({
      ...video,
      posterImageUrl: categoryImageMap[video.videoCategory] || "", // 캐시에 값이 없으면 빈 문자열
  }));

  console.log("cache loaded");
  
    try {
        
        const response = await fetch(`/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videos: updatedVideos }),
        });

        if (!response.ok) throw new Error('API 요청 실패');
        const data = await response.json();
        // categoryName과 posterImageUrl을 캐시에 업데이트
        const newCache = { ...categoryImageMap }; // 기존 캐시 복사
        data.forEach((category: { categoryName: string; posterImageUrl: string }) => {
            console.log(`categoryName ${category.categoryName} to posterImageUrl ${category.posterImageUrl}`);
            newCache[category.categoryName] = category.posterImageUrl; // 캐시 업데이트
        });

        saveCache(newCache); // 업데이트된 캐시 저장

        console.log("cache updated:", newCache);

        return data;
    } catch (error) {
        console.error('카테고리 검색 중 오류:', error);
    }

    return [];
};

export default CategoryStatisticsTable;