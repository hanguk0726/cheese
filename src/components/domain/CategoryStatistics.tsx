import React, { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CategoryStatistics } from '@/model/Category';
import SwapVertIcon from '@mui/icons-material/SwapVert';


const TableContainer = styled.div`
  margin: 20px;
  width: calc(100vw - 40px); // 뷰포트 너비에서 좌우 마진 제외
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 1rem;

`;

const Table = styled.table`
  width: 100%;
  min-width: 800px; // 테이블의 최소 너비 설정
  border-collapse: collapse;

  th {
    cursor: pointer;
    background-color: #f5f5f5;
    position: relative;

    .header-content {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }

  td img {
    max-width: 4rem;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
`;


const SearchInput = styled.input`
  width: 100%;
  min-width: 800px; 
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const CategoryTable = ({ data }: { data: CategoryStatistics[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof CategoryStatistics>('totalLivePv');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  return (
    <TableContainer>
      <SearchInput
        type="text"
        placeholder="카테고리 검색"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <Table>
        <thead>
          <tr>
            <th onClick={() => setSortColumn('categoryName')}>
                <span className="header-content">
                  Game <SwapVertIcon fontSize='small' />
                </span>
            </th>
            <th onClick={() => setSortColumn('totalVideos')}>
              <span className="header-content">
                Total Videos <SwapVertIcon />
              </span>
            </th>
            <th onClick={() => setSortColumn('totalDuration')}>
                <span className="header-content">
                  Total Duration <SwapVertIcon fontSize='small' />
                </span>
            </th>
            <th onClick={() => setSortColumn('averageDuration')}>
                <span className="header-content">
                  Avg Duration <SwapVertIcon fontSize='small' />
                </span>
            </th>
            <th onClick={() => setSortColumn('totalLivePv')}>
              <span className="header-content">
                Total Live PV <SwapVertIcon fontSize='small' />
              </span>
            </th>
            <th onClick={() => setSortColumn('averageLivePv')}>
              <span className="header-content">
                Avg Live PV <SwapVertIcon fontSize='small' />
              </span>
            </th>
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