import React, { useState, useEffect, useRef } from 'react';
import '../styles/score.css';
import { convertToAlphaTab } from '../utils/scoreConverter';
import TabView from './TabView';
import StaffView from './StaffView';
import ChordDiagram from './ChordDiagram';

interface ScoreViewerProps {
  result: any;
  currentTime?: number;
  isPlaying?: boolean;
}

type ViewMode = 'tab' | 'staff' | 'both' | 'chords';

const ScoreViewer: React.FC<ScoreViewerProps> = ({ result, currentTime = 0, isPlaying = false }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('tab');
  const [alphaTabScore, setAlphaTabScore] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      if (result && result.guitar_analysis) {
        const score = convertToAlphaTab(result);
        setAlphaTabScore(score);
        setError('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to convert score');
    }
  }, [result]);

  if (!alphaTabScore) {
    return (
      <div className="score-viewer">
        <div className="score-placeholder">
          <p>📊 Process audio to view score</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="score-viewer">
        <div className="score-error">
          <p>❌ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="score-viewer">
      <div className="score-toolbar">
        <div className="view-buttons">
          <button
            className={`view-btn ${viewMode === 'tab' ? 'active' : ''}`}
            onClick={() => setViewMode('tab')}
            title="Tab View"
          >
            🎸 Tab
          </button>
          <button
            className={`view-btn ${viewMode === 'staff' ? 'active' : ''}`}
            onClick={() => setViewMode('staff')}
            title="Staff View"
          >
            🎵 Staff
          </button>
          <button
            className={`view-btn ${viewMode === 'both' ? 'active' : ''}`}
            onClick={() => setViewMode('both')}
            title="Both Views"
          >
            📄 Both
          </button>
          <button
            className={`view-btn ${viewMode === 'chords' ? 'active' : ''}`}
            onClick={() => setViewMode('chords')}
            title="Chord Diagrams"
          >
            🎼 Chords
          </button>
        </div>

        <div className="score-info">
          <span className="info-item">
            <strong>BPM:</strong> {alphaTabScore.tempo}
          </span>
          <span className="info-item">
            <strong>Key:</strong> {alphaTabScore.key}
          </span>
          <span className="info-item">
            <strong>Time:</strong> {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <div className="score-content">
        {(viewMode === 'tab' || viewMode === 'both') && (
          <TabView score={alphaTabScore} currentTime={currentTime} isPlaying={isPlaying} />
        )}

        {(viewMode === 'staff' || viewMode === 'both') && (
          <StaffView score={alphaTabScore} currentTime={currentTime} isPlaying={isPlaying} />
        )}

        {viewMode === 'chords' && (
          <ChordDiagram score={alphaTabScore} />
        )}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default ScoreViewer;
