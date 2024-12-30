import React, { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CategoryStatistics } from '@/model/Category';

const TableContainer = styled.div`
  margin: 20px;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 768px) {
    margin: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    @media (max-width: 768px) {
      padding: 0.5rem;
      font-size: 14px;
    }
  }
  th {
    cursor: pointer;
    background-color: #f5f5f5;
  }
  td img {
    max-width: 2rem;
    margin-right: 0.5rem;
    vertical-align: middle;
    @media (max-width: 768px) {
      max-width: 1.5rem;
      margin-right: 0.25rem;
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.4rem;
  }
`;

const CategoryTable = ({ data }: { data: CategoryStatistics[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof CategoryStatistics>('totalLivePv');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedData = useMemo(() => {
    return data.filter(item =>
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];
      if (columnA < columnB) return sortDirection === 'asc' ? -1 : 1;
      if (columnA > columnB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchQuery, sortColumn, sortDirection]);

  return (
    <TableContainer>
      <div css={css`
        margin-bottom: 1rem;
      `}>
        <SearchInput
          type="text"
          placeholder="Search by game name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th onClick={() => setSortColumn('categoryName')}>Game</th>
            <th onClick={() => setSortColumn('totalVideos')}>Total Videos</th>
            <th onClick={() => setSortColumn('totalDuration')}>Total Duration</th>
            <th onClick={() => setSortColumn('averageDuration')}>Avg Duration</th>
            <th onClick={() => setSortColumn('totalLivePv')}>Total Live PV</th>
            <th onClick={() => setSortColumn('averageLivePv')}>Avg Live PV</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map(item => {
            // console.log('Item:', item);  
            return (
              <tr key={item.categoryName}>
                <td>
                  <img src={item.posterImageUrl} alt={item.categoryName} />
                  {item.categoryValue}
                </td>
                <td>{item.totalVideos.toLocaleString()}</td>
                <td>{item.totalDuration.toLocaleString()}</td>
                <td>{item.averageDuration.toFixed(2)}</td>
                <td>{item.totalLivePv.toLocaleString()}</td>
                <td>{item.averageLivePv.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;