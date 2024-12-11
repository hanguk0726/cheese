/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface SpacerProps {
  size?: number; // 간격 크기 (기본값: 16px)
  axis?: 'vertical' | 'horizontal'; // 방향 (수직 또는 수평)
}

const Spacer: React.FC<SpacerProps> = ({ size = 16, axis = 'vertical' }) => {
  const spacerStyle = css`
    ${axis === 'vertical' ? 'height' : 'width'}: ${size}px;
    ${axis === 'vertical' ? 'width' : 'height'}: 1px; /* 레이아웃을 유지 */
    display: inline-block;
  `;

  return <span css={spacerStyle} />;
};

export default Spacer;
