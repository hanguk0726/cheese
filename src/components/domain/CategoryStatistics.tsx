import { useState, useMemo } from 'react';
import { CategoryColumn, CategoryStatistics } from '@/model/Category';
import CategoryStatisticsTableView from '../layout/CategoryStatistics';


const CategoryStatisticsTable = ({ data }: { data: CategoryStatistics[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof CategoryStatistics>('totalLivePv');
  const [sortDirection, _] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedData = useMemo(() => {
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

export default CategoryStatisticsTable;