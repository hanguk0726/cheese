import { CircularProgress } from '@mui/material';
import styled from '@emotion/styled';

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
`;

export default function Loading() {
  return (
    <LoadingWrapper>
      <CircularProgress />
    </LoadingWrapper>
  );
}
