/**
 * 进度条组件
 * 显示异步操作的进度
 */

import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // 0-100
  isVisible?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isVisible = true,
  label,
  animated = true,
}) => {
  if (!isVisible) return null;

  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar ${animated ? 'animated' : ''}`}
          style={{
            width: `${percentage}%`,
          }}
        >
          <span className="progress-text">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
