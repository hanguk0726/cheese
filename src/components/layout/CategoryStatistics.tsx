import styled from '@emotion/styled';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { CategoryColumn, CategoryStatistics, CategoryStatisticsTableViewProps } from '@/model/category';


const Wrapper = styled.div`
  margin: 20px;
  width:100%;
  max-width: calc(100vw - 40px); // 뷰포트 너비에서 좌우 마진 제외
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  min-width: 800px; // 테이블의 최소 너비 설정
  border-collapse: collapse;

  th {
    cursor: pointer;
    background-color: #f5f5f5;
    position: relative;
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

const HeaderStyle = styled.span`
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const TableHeader = ({ columnName, onClickColumn }: { columnName: string, onClickColumn: () => void }) => {
  return (
    <th onClick={() => onClickColumn()}>
      <HeaderStyle>
        {columnName} <SwapVertIcon fontSize='small' />
      </HeaderStyle>
    </th>
  );
};

const CategoryStatisticsTableView : React.FC<CategoryStatisticsTableViewProps> = ({ searchQuery, onChangeSearchQuery, data, columns, onClickColumn }) => {
  return (
    <Wrapper>
      <SearchInput
        type="text"
        placeholder="카테고리 검색"
        value={searchQuery}
        onChange={e => onChangeSearchQuery(e.target.value)}
      />
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {columns.map(item => (
                <TableHeader key={item.name} columnName={item.label} onClickColumn={() => onClickColumn(item.name)} />
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              return (
                <tr key={item.categoryName}>
                  <td>
                    <img src={item.posterImageUrl} alt={item.categoryName} />
                    {item.categoryValue}
                  </td>
                  <td>{item.totalVideos.toLocaleString()}</td>
                  <td>{item.totalDuration.toLocaleString()}</td>
                  <td>{Math.round(item.averageDuration)}</td>
                  <td>{item.totalLivePv.toLocaleString()}</td>
                  <td>{Math.round(item.averageLivePv)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

export default CategoryStatisticsTableView;