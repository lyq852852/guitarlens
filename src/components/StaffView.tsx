import React from 'react';
import '../styles/score.css';

interface StaffViewProps {
  score: any;
  currentTime?: number;
  isPlaying?: boolean;
}

const StaffView: React.FC<StaffViewProps> = ({ score, currentTime = 0, isPlaying = false }) => {
  return (
    <div className="staff-view">
      <div className="staff-container">
        {/* 五线谱 */}
        <div className="staff">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="staff-line" />
          ))}
        </div>
      </div>

      <div className="staff-info">
        <p>🎵 Staff view will display musical notation here</p>
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

export default StaffView;
