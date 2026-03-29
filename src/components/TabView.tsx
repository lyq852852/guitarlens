import React, { useMemo } from 'react';
import '../styles/score.css';

interface TabViewProps {
  score: any;
  currentTime?: number;
  isPlaying?: boolean;
}

const TabView: React.FC<TabViewProps> = ({ score, currentTime = 0, isPlaying = false }) => {
  const tabLines = useMemo(() => {
    // 生成 Tab 谱线
    const lines = [
      { string: 1, name: 'e' },
      { string: 2, name: 'B' },
      { string: 3, name: 'G' },
      { string: 4, name: 'D' },
      { string: 5, name: 'A' },
      { string: 6, name: 'E' },
    ];

    return lines;
  }, []);

  return (
    <div className="tab-view">
      <div className="tab-container">
        {tabLines.map((line) => (
          <div key={line.string} className="tab-line">
            <div className="tab-string-label">{line.name}</div>
            <div className="tab-string-content">
              {/* 生成 Tab 内容 */}
              {Array.from({ length: 80 }).map((_, i) => (
                <span key={i} className="tab-char">
                  -
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tab-info">
        <p>📊 Tab view will display guitar tablature here</p>
        <p>Current time: {formatTime(currentTime)}</p>
        {isPlaying && <p>▶ Playing...</p>}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default TabView;
